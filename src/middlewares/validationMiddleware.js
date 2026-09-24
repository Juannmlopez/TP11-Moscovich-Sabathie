// Middlewares de validación de datos.
// Comprueban que el body de la solicitud contenga los campos mínimos requeridos antes de ejecutar el controller.

function validarRegistro(req, res, next) {
  const { nombre_usuario, nombre_completo, email, password } = req.body;

  if (!nombre_usuario || !nombre_completo || !email || !password) {
    return res.status(400).json({
      mensaje: 'Faltan campos obligatorios: nombre_usuario, nombre_completo, email, password'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  next();
}

function validarLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y password son obligatorios' });
  }

  next();
}

function validarPublicacion(req, res, next) {
  const { url_imagen } = req.body;

  if (!url_imagen) {
    return res.status(400).json({ mensaje: 'La url_imagen es obligatoria' });
  }

  next();
}

module.exports = { validarRegistro, validarLogin, validarPublicacion };
