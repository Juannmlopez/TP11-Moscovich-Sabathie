# API Backend - Clon de Instagram

Backend en Node.js + Express, conectado a PostgreSQL (Supabase), con login, registro, JWT y manejo de publicaciones.

## 1. Arquitectura por capas

```
/src
  /config         -> Conexion a la base de datos (Pool de pg). Lee el .env
  /controllers    -> Recibe req y res. Llama a los services y devuelve la respuesta HTTP
  /middlewares    -> Funciones que se ejecutan ANTES del controller (validar token, validar datos)
  /routes         -> Define las URLs y que middleware/controller usa cada una
  /services       -> Unico lugar donde se escriben consultas SQL. No conoce req ni res
  app.js          -> Arranca Express, conecta las rutas y levanta el servidor
```

Flujo de una peticion (ejemplo: crear una publicacion):

```
Cliente -> routes/postRoutes.js -> middlewares/authMiddleware.js -> middlewares/validationMiddleware.js
        -> controllers/postController.js -> services/postService.js -> Base de datos (Supabase)
```

El controller nunca escribe SQL, y el service nunca toca `req` o `res`. Esa separación es la que pide la consigna.

## 2. Base de datos (Supabase / PostgreSQL)

Script completo en `sql/schema.sql`. Se pega en Supabase -> SQL Editor -> Run.

### Tabla `usuarios`
| Columna | Tipo | Detalle |
|---|---|---|
| id | SERIAL | Primary Key |
| nombre_usuario | VARCHAR(50) | UNIQUE, NOT NULL |
| nombre_completo | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (se guarda encriptada con bcrypt) |
| foto_perfil | VARCHAR(255) | Opcional, tiene default |
| biografia | TEXT | Opcional |

### Tabla `publicaciones`
| Columna | Tipo | Detalle |
|---|---|---|
| id | SERIAL | Primary Key |
| usuario_id | INT | FK -> usuarios(id), ON DELETE CASCADE |
| url_imagen | VARCHAR(255) | NOT NULL |
| descripcion | TEXT | Opcional |
| likes | INT | Default 0 |
| fecha_creacion | TIMESTAMP | Default CURRENT_TIMESTAMP |

Relación: **un usuario tiene muchas publicaciones** (One-to-Many). Si se borra un usuario, se borran sus publicaciones (CASCADE).

## 3. Endpoints

### Públicos (no necesitan token)

**POST `/api/auth/register`**
```json
// Body
{
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Perez",
  "email": "juan@mail.com",
  "password": "123456"
}
// Respuesta 201
{ "mensaje": "Usuario creado correctamente", "usuario": { ... } }
```

**POST `/api/auth/login`**
```json
// Body
{ "email": "juan@mail.com", "password": "123456" }
// Respuesta 200
{ "mensaje": "Login exitoso", "token": "eyJhbGciOi...", "usuario": { ... } }
```

**GET `/api/publicaciones`** -> Devuelve el feed completo (array de publicaciones con datos del autor).

### Protegidos (requieren header `Authorization: Bearer <token>`)

**GET `/api/usuarios/perfil`** -> Devuelve el usuario logueado + sus publicaciones.

**PUT `/api/usuarios/perfil`**
```json
// Body (todos los campos son opcionales)
{ "nombre_completo": "Juan P.", "biografia": "Amante de los gatos", "foto_perfil": "https://..." }
```

**POST `/api/publicaciones`**
```json
// Body
{ "url_imagen": "https://cataas.com/cat", "descripcion": "Mi gato" }
// Respuesta 201
{ "mensaje": "Publicacion creada correctamente", "publicacion": { ... } }
```

## 4. JWT - Como funciona

1. En el **login**, si el email y password son correctos, se firma un token con `jwt.sign()` usando `JWT_SECRET` (definido en `.env`).
2. El payload del token guarda solo: `id`, `nombre_usuario` y `email` del usuario. **Nunca se guarda la password**, ni en el token ni en texto plano en la base.
3. El token expira segun `JWT_EXPIRES_IN` (por defecto 2 horas).
4. En cada ruta protegida, el cliente debe mandar el header:
   ```
   Authorization: Bearer eyJhbGciOi...
   ```
5. El middleware `authMiddleware.js` lee ese header, separa la palabra "Bearer" del token, y usa `jwt.verify()` para chequear la firma. Si es válido, guarda los datos decodificados en `req.user` para que el controller los use (por ejemplo, `req.user.id`). Si no es válido o no está, responde `401 Unauthorized` y corta la petición ahí mismo (el controller nunca se ejecuta).

## 5. Como correrlo

```bash
npm install
cp .env.example .env   # completar con los datos reales de Supabase
npm run dev             # o npm start
```

El servidor queda escuchando en `http://localhost:3000`.

## 6. Documentación Swagger

Con el servidor levantado, la documentación interactiva está en `http://localhost:3000/api-docs`. Ver `DOCUMENTACION_SWAGGER.md` para el detalle. Si se modifican endpoints o anotaciones, ejecutar `npm run swagger` (también se ejecuta solo con `npm run dev` / `npm start`).
"# TP-08---PG-Provincias" 
"# TP11-Moscovich-Sabathie" 
