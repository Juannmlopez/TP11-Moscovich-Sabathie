-- Esquema reconstruido a partir de la seccion 2 del README.
-- Pegar en Supabase -> SQL Editor -> Run.

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  nombre_completo VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  foto_perfil VARCHAR(255) DEFAULT 'https://cataas.com/cat',
  biografia TEXT
);

CREATE TABLE IF NOT EXISTS publicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  url_imagen VARCHAR(255) NOT NULL,
  descripcion TEXT,
  likes INT DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
