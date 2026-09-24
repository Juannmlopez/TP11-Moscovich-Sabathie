const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validarRegistro, validarLogin } = require('../middlewares/validationMiddleware');

// Rutas publicas para autenticación.
// No requieren token porque son necesarias para crear cuenta e iniciar sesión.
router.post('/register', validarRegistro, authController.register);
router.post('/login', validarLogin, authController.login);

module.exports = router;
