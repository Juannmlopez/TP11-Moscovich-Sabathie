// Configuracion de la conexion a la base de datos.
// Crea un pool de conexiones a PostgreSQL usando las variables de entorno.
// Este pool se reutiliza desde los servicios para ejecutar consultas.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase y otras bases de datos gestionadas requieren SSL
});

// Intento de conexion inicial para validar la configuracion
pool.connect()
  .then(() => console.log('Conectado a la base de datos correctamente'))
  .catch((error) => console.error('Error al conectar con la base de datos:', error.message));

module.exports = pool;
