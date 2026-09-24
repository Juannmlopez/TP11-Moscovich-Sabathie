// Capa de servicios para publicaciones.
// Contiene las consultas a la base de datos para obtener y crear posts.

const pool = require('../config/db');

// Trae todas las publicaciones del feed junto al nombre y foto de perfil del autor.
async function obtenerTodasLasPublicaciones() {
  const query = `
    SELECT publicaciones.*, usuarios.nombre_usuario, usuarios.foto_perfil
    FROM publicaciones
    JOIN usuarios ON publicaciones.usuario_id = usuarios.id
    ORDER BY publicaciones.fecha_creacion DESC
  `;
  const resultado = await pool.query(query);
  return resultado.rows;
}

// Inserta una nueva publicacion en la base de datos para un usuario.
async function crearPublicacion({ usuario_id, url_imagen, descripcion }) {
  const query = `
    INSERT INTO publicaciones (usuario_id, url_imagen, descripcion)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const resultado = await pool.query(query, [usuario_id, url_imagen, descripcion]);
  return resultado.rows[0];
}

module.exports = {
  obtenerTodasLasPublicaciones,
  crearPublicacion
};
