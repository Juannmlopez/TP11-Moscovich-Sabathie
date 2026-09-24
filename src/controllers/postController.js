// Controller de publicaciones.
// Gestiona las peticiones de feed y creacion de publicaciones, usando postService.

const postService = require('../services/postService');

// Devuelve todas las publicaciones disponibles en el feed.
async function obtenerPublicaciones(req, res) {
  /*  #swagger.tags = ['Publicaciones']
      #swagger.summary = 'Obtener el feed'
      #swagger.description = 'Devuelve todas las publicaciones (más recientes primero) con nombre y foto del autor.'
      #swagger.responses[200] = {
        description: 'Lista de publicaciones',
        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Publicacion' } } } }
      }
      #swagger.responses[500] = { description: 'Error interno del servidor' }
  */
  try {
    const publicaciones = await postService.obtenerTodasLasPublicaciones();
    return res.json(publicaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

// Crea una nueva publicacion para el usuario autentificado.
// El id del usuario se obtiene de req.user, que establece el middleware de auth.
async function crearPublicacion(req, res) {
  /*  #swagger.tags = ['Publicaciones']
      #swagger.summary = 'Crear una publicación'
      #swagger.description = 'El autor se toma del token; no hay que enviar usuario_id.'
      #swagger.security = [{ bearerAuth: [] }]
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/PublicacionBody' } } }
      }
      #swagger.responses[201] = {
        description: 'Publicación creada',
        content: { 'application/json': { schema: { type: 'object', properties: {
          mensaje: { type: 'string', example: 'Publicacion creada correctamente' },
          publicacion: { $ref: '#/components/schemas/Publicacion' } } } } }
      }
      #swagger.responses[400] = {
        description: 'La url_imagen es obligatoria',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[401] = {
        description: 'Token ausente, inválido o expirado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensaje' } } }
      }
      #swagger.responses[500] = { description: 'Error interno del servidor' }
  */
  try {
    const usuarioId = req.user.id; // Viene del token
    const { url_imagen, descripcion } = req.body;

    const nuevaPublicacion = await postService.crearPublicacion({
      usuario_id: usuarioId,
      url_imagen,
      descripcion
    });

    return res.status(201).json({
      mensaje: 'Publicacion creada correctamente',
      publicacion: nuevaPublicacion
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

module.exports = { obtenerPublicaciones, crearPublicacion };
