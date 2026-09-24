# TP11 - Swagger - API Clon de Instagram

Autores: Moscovich, Sabathie

## 1. Selección y análisis de la API

- **Proyecto:** API Clon de Instagram (proyecto base: TP09 Middlewares)
- **Descripción:** Backend en Node.js + Express + PostgreSQL (Supabase) con arquitectura por capas (routes, middlewares, controllers, services). Permite registrar usuarios, iniciar sesión con JWT, ver y editar el perfil, y publicar/consultar el feed de imágenes.
- **Tipo de API:** Propia.
- **URL base:** `http://localhost:3000` (prefijos `/api/auth`, `/api/usuarios`, `/api/publicaciones`)
- **Documentación Swagger:** `http://localhost:3000/api-docs`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registra un usuario nuevo |
| POST | `/api/auth/login` | No | Inicia sesión y devuelve un token JWT |
| GET | `/api/usuarios/perfil` | Sí | Devuelve el perfil del usuario logueado y sus publicaciones |
| PUT | `/api/usuarios/perfil` | Sí | Modifica nombre, biografía o foto del usuario logueado |
| GET | `/api/publicaciones` | No | Devuelve el feed completo |
| POST | `/api/publicaciones` | Sí | Crea una publicación para el usuario logueado |

> La API no posee endpoints DELETE ni parámetros de ruta/consulta.

## 2. Integración de Swagger

- `swagger-autogen`: genera `swagger-output.json` leyendo `src/app.js` y los comentarios `#swagger` de los controllers (configuración en `swagger.js`).
- `swagger-ui-express`: sirve la documentación en `/api-docs` (configurado en `src/app.js`).

## 3 y 6. Endpoints y códigos de respuesta documentados

| Endpoint | Códigos | Significado |
|---|---|---|
| POST `/api/auth/register` | 201, 400, 500 | Creado / faltan campos, password < 6 o usuario duplicado / error interno |
| POST `/api/auth/login` | 200, 400, 401, 500 | OK / faltan campos / credenciales incorrectas / error interno |
| GET `/api/usuarios/perfil` | 200, 401, 404, 500 | OK / token ausente o inválido / usuario no existe / error interno |
| PUT `/api/usuarios/perfil` | 200, 401, 500 | Actualizado / token ausente o inválido / error interno |
| GET `/api/publicaciones` | 200, 500 | Feed / error interno |
| POST `/api/publicaciones` | 201, 400, 401, 500 | Creada / falta url_imagen / token ausente o inválido / error interno |

## 4. Modelos

**Usuario**

| Propiedad | Tipo | Descripción |
|---|---|---|
| id | integer | Identificador único |
| nombre_usuario | string | Nombre de usuario único |
| nombre_completo | string | Nombre y apellido |
| email | string | Correo electrónico único |
| foto_perfil | string | URL de la foto de perfil |
| biografia | string | Texto de presentación |

**Publicacion**

| Propiedad | Tipo | Descripción |
|---|---|---|
| id | integer | Identificador de la publicación |
| usuario_id | integer | ID del autor |
| url_imagen | string | URL de la imagen |
| descripcion | string | Texto de la publicación |
| likes | integer | Cantidad de likes (default 0) |
| fecha_creacion | string (date-time) | Fecha de creación |
| nombre_usuario | string | Autor (solo en el feed) |
| foto_perfil | string | Foto del autor (solo en el feed) |

Además: `RegistroBody`, `LoginBody`, `PerfilBody`, `PublicacionBody` (bodies de entrada) y `Mensaje` (`{ "mensaje": "..." }`).

## 5. Pruebas en Swagger UI (checklist)

Para cada prueba: sacar captura y verificar (1) la solicitud se ejecutó, (2) el body enviado es el esperado, (3) la respuesta coincide con la documentación, (4) el código HTTP es correcto.

| # | Prueba | Esperado |
|---|---|---|
| 1 | POST `/api/auth/register` con body válido | 201 |
| 2 | POST `/api/auth/register` repitiendo el email | 400 |
| 3 | POST `/api/auth/login` con las credenciales del paso 1 | 200 + token |
| 4 | Botón **Authorize** → pegar el token (sin escribir "Bearer") | Candados cerrados |
| 5 | GET `/api/usuarios/perfil` | 200 |
| 6 | PUT `/api/usuarios/perfil` con `{"biografia":"Hola"}` | 200 |
| 7 | POST `/api/publicaciones` con `{"url_imagen":"https://cataas.com/cat","descripcion":"Mi gato"}` | 201 |
| 8 | GET `/api/publicaciones` | 200, aparece la publicación |
| 9 | *Logout* en Authorize y GET `/api/usuarios/perfil` | 401 |

## Cómo correrlo

```bash
npm install
cp .env.example .env     # completar con los datos reales de Supabase
# ejecutar sql/schema.sql en Supabase (si las tablas no existen)
npm run dev              # regenera swagger-output.json y levanta el servidor
```

Abrir `http://localhost:3000/api-docs`.
