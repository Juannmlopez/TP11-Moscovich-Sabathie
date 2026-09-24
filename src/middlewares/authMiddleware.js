// Middleware de autenticación para rutas protegidas.
// Valida el token JWT enviado en el header Authorization y agrega los datos del usuario a req.user.

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'No se envio el token de autenticacion' });
  }

  // El header debe venir con el formato: "Bearer eyJhbGciOi..."
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'Formato de token invalido' });
  }

  const token = partes[1];

  try {
    const datosDelToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = datosDelToken; // Guardamos los datos del usuario para usarlos en el controller
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado' });
  }
}

module.exports = verificarToken;
