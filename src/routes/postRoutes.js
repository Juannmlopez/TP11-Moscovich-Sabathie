const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const verificarToken = require('../middlewares/authMiddleware');
const { validarPublicacion } = require('../middlewares/validationMiddleware');

// Rutas de publicaciones.
// GET es publica para ver el feed; POST es protegida para crear nuevas publicaciones.
router.get('/', postController.obtenerPublicaciones);
router.post('/', verificarToken, validarPublicacion, postController.crearPublicacion);

module.exports = router;
