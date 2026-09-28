// Controller de usuario.
// Atiende las solicitudes relacionadas con el perfil del usuario, usando userService.

const userService = require('../services/userService');

// Obtiene los datos de perfil del usuario logueado y sus publicaciones.
async function obtenerPerfil(req, res) {
  /*  #swagger.tags = ['Usuarios']
      #swagger.summary = 'Obtener mi perfil'
      #swagger.description = 'Devuelve el usuario del token y todas sus publicaciones.'
      #swagger.security = [{ bearerAuth: [] }]
      #swagger.responses[200] = {
        description: 'Perfil obtenido',
        content: { 'application/json': { schema: { type: 'object', properties: {
          usuario: { $ref: '#/components/schemas/Usuario' },
          publicaciones: { type: 'array', items: { $ref: '#/components/schemas/Publicacion' } } } } } }
      }
      #swagger.responses[401] = {
        description: 'Token ausente, con formato inválido o expirado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[404] = {
        description: 'Usuario no encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[500] = { description: 'Error interno del servidor' }
  */
  try {
    const usuarioId = req.user.id; // Viene del token, lo puso el authMiddleware

    const usuario = await userService.obtenerPerfilPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const publicaciones = await userService.obtenerPublicacionesPorUsuario(usuarioId);

    return res.json({ usuario, publicaciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

// Actualiza los datos del perfil del usuario logueado.
async function actualizarPerfil(req, res) {
  /*  #swagger.tags = ['Usuarios']
      #swagger.summary = 'Actualizar mi perfil'
      #swagger.description = 'Modifica solo los campos enviados; los omitidos conservan su valor.'
      #swagger.security = [{ bearerAuth: [] }]
            #swagger.requestBody = {
        required: true,
        content: {
          'application/x-www-form-urlencoded': { schema: { $ref: '#/components/schemas/PerfilBody' } },
          'application/json': { schema: { $ref: '#/components/schemas/PerfilBody' } }
        }
      }
      #swagger.responses[200] = {
        description: 'Perfil actualizado',
        content: { 'application/json': { schema: { type: 'object', properties: {
          mensaje: { type: 'string', example: 'Perfil actualizado correctamente' },
          usuario: { $ref: '#/components/schemas/Usuario' } } } } }
      }
      #swagger.responses[401] = {
        description: 'Token ausente, inválido o expirado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[500] = { description: 'Error interno del servidor' }
  */
  try {
    const usuarioId = req.user.id;
    const { nombre_completo, biografia, foto_perfil } = req.body;

    const usuarioActualizado = await userService.actualizarPerfil(usuarioId, {
      nombre_completo,
      biografia,
      foto_perfil
    });

    return res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

module.exports = { obtenerPerfil, actualizarPerfil };
