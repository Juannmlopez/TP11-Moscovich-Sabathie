// Capa de servicios para usuarios.
// Aquí se realizan las consultas necesarias para obtener y actualizar datos de usuario.

const pool = require('../config/db');

// Trae los datos publicos del perfil de un usuario por su id.
// No devuelve la contraseña.
async function obtenerPerfilPorId(id) {
  const query = `
    SELECT id, nombre_usuario, nombre_completo, email, foto_perfil, biografia
    FROM usuarios
    WHERE id = $1
  `;
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
}

// Trae todas las publicaciones creadas por un usuario en particular.
async function obtenerPublicacionesPorUsuario(usuario_id) {
  const query = `
    SELECT * FROM publicaciones
    WHERE usuario_id = $1
    ORDER BY fecha_creacion DESC
  `;
  const resultado = await pool.query(query, [usuario_id]);
  return resultado.rows;
}

// Actualiza los campos de perfil que el usuario envió.
// COALESCE mantiene el valor anterior si no se envía un campo.
async function actualizarPerfil(id, { nombre_completo, biografia, foto_perfil }) {
  const query = `
    UPDATE usuarios
    SET nombre_completo = COALESCE($1, nombre_completo),
        biografia = COALESCE($2, biografia),
        foto_perfil = COALESCE($3, foto_perfil)
    WHERE id = $4
    RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia
  `;
  const resultado = await pool.query(query, [nombre_completo, biografia, foto_perfil, id]);
  return resultado.rows[0];
}

module.exports = {
  obtenerPerfilPorId,
  obtenerPublicacionesPorUsuario,
  actualizarPerfil
};
