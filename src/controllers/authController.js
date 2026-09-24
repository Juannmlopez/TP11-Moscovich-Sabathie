// Controller de autenticación.
// Recibe las peticiones HTTP, valida la informacion basica y delega la logica a authService.
// Responde al cliente con mensajes y datos apropiados.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../services/authService');

// Registro de un nuevo usuario.
// Valida un correo/usuario existente, crea el usuario y devuelve datos basicos.
async function register(req, res) {
  /*  #swagger.tags = ['Autenticación']
      #swagger.summary = 'Registrar un usuario'
      #swagger.description = 'Crea una cuenta nueva. La contraseña se guarda encriptada con bcrypt.'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/RegistroBody' } } }
      }
      #swagger.responses[201] = {
        description: 'Usuario creado correctamente',
        content: { 'application/json': { schema: { type: 'object', properties: {
          mensaje: { type: 'string', example: 'Usuario creado correctamente' },
          usuario: { $ref: '#/components/schemas/Usuario' } } } } }
      }
      #swagger.responses[400] = {
        description: 'Faltan campos, contraseña de menos de 6 caracteres, o email/usuario ya registrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[500] = { description: 'Error interno del servidor' }
  */
  try {
    const { nombre_usuario, nombre_completo, email, password } = req.body;

    const usuarioExistente = await authService.buscarUsuarioPorEmailOUsername(email, nombre_usuario);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email o el nombre de usuario ya estan registrados' });
    }

    const nuevoUsuario = await authService.crearUsuario({ nombre_usuario, nombre_completo, email, password });

    return res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

// Login de usuario.
// Verifica email y contraseña, genera un JWT y devuelve los datos de usuario sin la contraseña.
async function login(req, res) {
  /*  #swagger.tags = ['Autenticación']
      #swagger.summary = 'Iniciar sesión'
      #swagger.description = 'Verifica email y contraseña y devuelve un token JWT (válido 2 horas).'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } }
      }
      #swagger.responses[200] = {
        description: 'Login exitoso',
        content: { 'application/json': { schema: { type: 'object', properties: {
          mensaje: { type: 'string', example: 'Login exitoso' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          usuario: { $ref: '#/components/schemas/Usuario' } } } } }
      }
      #swagger.responses[400] = {
        description: 'Email o password no enviados',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[401] = {
        description: 'Email o contraseña incorrectos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[500] = { description: 'Error interno del servidor' }
  */
  try {
    const { email, password } = req.body;

    const usuario = await authService.buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

module.exports = { register, login };
