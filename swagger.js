// Genera swagger-output.json a partir de las rutas de src/app.js
// y de los comentarios #swagger escritos en los controllers.
// Ejecutar con: npm run swagger

const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0', language: 'es-ES', autoHeaders: false });

const doc = {
  info: {
    title: 'API Clon de Instagram',
    version: '1.0.0',
    description: 'Backend con Node.js, Express, PostgreSQL (Supabase) y autenticación JWT'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  tags: [
    { name: 'Autenticación', description: 'Registro e inicio de sesión (públicos)' },
    { name: 'Usuarios', description: 'Perfil del usuario logueado (requieren token)' },
    { name: 'Publicaciones', description: 'Feed y creación de publicaciones' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identificador único del usuario', example: 1 },
          nombre_usuario: { type: 'string', description: 'Nombre de usuario único (@usuario)', example: 'gato_programador' },
          nombre_completo: { type: 'string', description: 'Nombre y apellido', example: 'Juan Perez' },
          email: { type: 'string', description: 'Correo electrónico único', example: 'juan@mail.com' },
          foto_perfil: { type: 'string', description: 'URL de la foto de perfil', example: 'https://...' },
          biografia: { type: 'string', description: 'Texto de presentación', example: 'Amante de los gatos' }
        }
      },
      Publicacion: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identificador de la publicación', example: 10 },
          usuario_id: { type: 'integer', description: 'ID del usuario autor', example: 1 },
          url_imagen: { type: 'string', description: 'URL de la imagen publicada', example: 'https://cataas.com/cat' },
          descripcion: { type: 'string', description: 'Texto de la publicación', example: 'Mi gato' },
          likes: { type: 'integer', description: 'Cantidad de likes (default 0)', example: 0 },
          fecha_creacion: { type: 'string', format: 'date-time', description: 'Fecha de creación', example: '2026-09-24T15:30:00.000Z' },
          nombre_usuario: { type: 'string', description: 'Autor (solo en el feed)', example: 'gato_programador' },
          foto_perfil: { type: 'string', description: 'Foto del autor (solo en el feed)', example: 'https://...' }
        }
      },
      RegistroBody: {
        type: 'object',
        required: ['nombre_usuario', 'nombre_completo', 'email', 'password'],
        properties: {
          nombre_usuario: { type: 'string', example: 'gato_programador' },
          nombre_completo: { type: 'string', example: 'Juan Perez' },
          email: { type: 'string', example: 'juan@mail.com' },
          password: { type: 'string', description: 'Mínimo 6 caracteres', example: '123456' }
        }
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'juan@mail.com' },
          password: { type: 'string', example: '123456' }
        }
      },
      PerfilBody: {
        type: 'object',
        description: 'Todos los campos son opcionales',
        properties: {
          nombre_completo: { type: 'string', example: 'Juan P.' },
          biografia: { type: 'string', example: 'Amante de los gatos' },
          foto_perfil: { type: 'string', example: 'https://...' }
        }
      },
      PublicacionBody: {
        type: 'object',
        required: ['url_imagen'],
        properties: {
          url_imagen: { type: 'string', example: 'https://cataas.com/cat' },
          descripcion: { type: 'string', example: 'Mi gato' }
        }
      },
      Mensaje: {
        type: 'object',
        properties: { mensaje: { type: 'string', example: 'Descripción del resultado o del error' } }
      }
    }
  }
};

swaggerAutogen('./swagger-output.json', ['./src/app.js'], doc);
