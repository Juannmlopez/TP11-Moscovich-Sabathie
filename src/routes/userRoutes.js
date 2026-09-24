const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas de usuario protegidas.
// Solo se puede acceder con un token de autenticación válido.
router.get('/perfil', verificarToken, userController.obtenerPerfil);
router.put('/perfil', verificarToken, userController.actualizarPerfil);

module.exports = router;
