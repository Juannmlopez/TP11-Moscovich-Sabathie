// Punto de entrada de la API.
// Configura Express, habilita middlewares globales y monta las rutas en la aplicacion.

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json'); // Generado con: npm run swagger

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middlewares globales
app.use(cors()); // Permite solicitudes desde otros orígenes
app.use(express.json()); // Parseo de JSON en el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true })); // Permite recibir formularios (un input por campo en Swagger)
// Montaje de rutas con prefijos
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/usuarios', userRoutes); // Rutas de usuario protegidas
app.use('/api/publicaciones', postRoutes); // Rutas de publicaciones

// Documentación interactiva (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Ruta pública de comprobación del servidor
app.get('/', (req, res) => {
  res.send('API del clon de Instagram funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
