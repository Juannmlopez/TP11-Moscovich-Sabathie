// Capa de servicios para autenticación.
// Aqui se ejecutan las consultas SQL y se prepara la data para los controllers.
// Esta capa no depende de Express ni maneja respuestas HTTP directamente.

const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Busca si ya existe un usuario con ese email o ese nombre de usuario.
async function buscarUsuarioPorEmailOUsername(email, nombre_usuario) {
  const query = 'SELECT * FROM usuarios WHERE email = $1 OR nombre_usuario = $2';
  const resultado = await pool.query(query, [email, nombre_usuario]);
  return resultado.rows[0];
}

// Busca un usuario solo por email (usado en el login).
async function buscarUsuarioPorEmail(email) {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const resultado = await pool.query(query, [email]);
  return resultado.rows[0];
}

// Crea un usuario nuevo en la base de datos, encriptando la contraseña antes de guardarla.
async function crearUsuario({ nombre_usuario, nombre_completo, email, password }) {
  const passwordEncriptada = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO usuarios (nombre_usuario, nombre_completo, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia
  `;
  const resultado = await pool.query(query, [nombre_usuario, nombre_completo, email, passwordEncriptada]);
  return resultado.rows[0];
}

module.exports = {
  buscarUsuarioPorEmailOUsername,
  buscarUsuarioPorEmail,
  crearUsuario
};
