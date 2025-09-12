# API REST de Gestión de Alumnos con Rust

Una API REST completa desarrollada en Rust para la gestión de alumnos, implementando operaciones CRUD con documentación Swagger/OpenAPI, validación de datos, paginación y filtros avanzados.

## 📚 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías y Frameworks](#tecnologías-y-frameworks)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Base de Datos](#base-de-datos)
- [Uso de la API](#uso-de-la-api)
- [Endpoints](#endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Validaciones](#validaciones)
- [Documentación Swagger](#documentación-swagger)
- [Comandos de Rust](#comandos-de-rust)
- [Arquitectura y Funcionamiento](#arquitectura-y-funcionamiento)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Troubleshooting](#troubleshooting)

## 🎯 Descripción

Este proyecto es una práctica completa para aprender Rust aplicado al desarrollo web, específicamente en la creación de APIs REST. Implementa un sistema de gestión de alumnos con todas las operaciones CRUD (Create, Read, Update, Delete), documentación automática con Swagger, validación robusta de datos y características avanzadas como paginación y filtros.

### Objetivos de Aprendizaje

- **Rust para Web Development**: Entender cómo Rust se aplica en el desarrollo de APIs REST
- **Frameworks Web en Rust**: Aprender a usar Axum como framework web moderno
- **Gestión de Base de Datos**: Implementar operaciones de base de datos con SQLx
- **Documentación de APIs**: Generar documentación automática con Swagger/OpenAPI
- **Validación de Datos**: Implementar validaciones robustas en Rust
- **Arquitectura Modular**: Estructurar un proyecto Rust de manera escalable

## 🛠️ Tecnologías y Frameworks

### Core Technologies

#### **Rust** 
- **Versión**: 1.89.0
- **Edición**: 2021
- **Descripción**: Lenguaje de programación de sistemas que garantiza memoria segura sin recolector de basura

### Frameworks y Librerías

#### **Framework Web: Axum**
```toml
axum = "0.8.4"
```
- **Propósito**: Framework web moderno y ergonómico para Rust
- **Características**: 
  - Basado en hyper y tower
  - Excelente rendimiento
  - Sistema de routing flexible
  - Soporte nativo para async/await
  - Extractor patterns para request handling

#### **Runtime Asíncrono: Tokio**
```toml
tokio = { version = "1.0", features = ["full"] }
```
- **Propósito**: Runtime asíncrono para aplicaciones Rust
- **Características**:
  - Manejo de concurrencia
  - I/O no bloqueante
  - Task scheduling
  - Timer y timeout utilities

#### **Base de Datos: SQLx**
```toml
sqlx = { version = "0.8.6", features = ["runtime-tokio-rustls", "mysql", "chrono", "uuid"] }
```
- **Propósito**: Driver async para bases de datos con type safety
- **Características**:
  - Compile-time checked queries
  - Connection pooling
  - Migration support
  - Soporte para MySQL, PostgreSQL, SQLite

#### **Serialización: Serde**
```toml
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```
- **Propósito**: Framework de serialización/deserialización
- **Características**:
  - Conversión automática JSON ↔ Rust structs
  - Derive macros para automatización
  - Soporte para múltiples formatos

#### **Documentación API: Utoipa**
```toml
utoipa = { version = "5.4.0", features = ["axum_extras", "chrono", "uuid"] }
utoipa-swagger-ui = { version = "9.0.2", features = ["axum"] }
```
- **Propósito**: Generación automática de documentación OpenAPI/Swagger
- **Características**:
  - Derive macros para schemas
  - Integración con Axum
  - UI interactiva de Swagger

#### **Validación: Validator**
```toml
validator = { version = "0.20.0", features = ["derive"] }
```
- **Propósito**: Validación declarativa de datos
- **Características**:
  - Validaciones por atributos
  - Mensajes de error personalizados
  - Validaciones custom

#### **HTTP & Middleware: Tower**
```toml
tower = "0.5.2"
tower-http = { version = "0.6.6", features = ["cors", "trace"] }
```
- **Propósito**: Middleware para servicios HTTP
- **Características**:
  - CORS support
  - Request tracing
  - Rate limiting
  - Authentication middleware

#### **Logging: Tracing**
```toml
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
```
- **Propósito**: Framework de logging estructurado
- **Características**:
  - Structured logging
  - Distributed tracing
  - Performance profiling

#### **Utilidades**
```toml
chrono = { version = "0.4", features = ["serde"] }  # Manejo de fechas y tiempo
uuid = { version = "1.0", features = ["v4", "serde"] }  # Generación de UUIDs
anyhow = "1.0"  # Error handling simplificado
dotenv = "0.15"  # Carga de variables de entorno
```

## ✨ Características

### Funcionalidades Core
- ✅ **CRUD Completo**: Create, Read, Update, Delete de alumnos
- ✅ **Validación Robusta**: Validaciones automáticas de datos de entrada
- ✅ **Paginación**: Sistema de paginación eficiente
- ✅ **Filtros Avanzados**: Búsqueda por texto, carrera, estatus
- ✅ **Documentación Automática**: Swagger UI integrado
- ✅ **Manejo de Errores**: Respuestas de error estructuradas
- ✅ **CORS Support**: Configuración para desarrollo frontend

### Características Técnicas
- 🚀 **Alto Rendimiento**: Aprovecha la velocidad nativa de Rust
- 🔒 **Type Safety**: Verificación de tipos en tiempo de compilación
- 🔄 **Async/Await**: Operaciones no bloqueantes
- 📊 **Connection Pooling**: Gestión eficiente de conexiones DB
- 🛡️ **Memory Safety**: Garantías de seguridad de memoria de Rust

## 📁 Estructura del Proyecto

```
rust-api-rest/
│
├── src/
│   ├── main.rs                 # Punto de entrada de la aplicación
│   ├── lib.rs                  # Configuración de módulos públicos
│   │
│   ├── models/                 # Modelos de datos y DTOs
│   │   ├── mod.rs             # Exportaciones del módulo
│   │   └── alumno.rs          # Estructuras de Alumno y requests
│   │
│   ├── handlers/               # Controladores de rutas
│   │   ├── mod.rs             # Exportaciones del módulo
│   │   └── alumnos.rs         # Handlers para operaciones de alumnos
│   │
│   └── database/               # Configuración de base de datos
│       ├── mod.rs             # Exportaciones del módulo
│       └── connection.rs      # Pool de conexiones y configuración
│
├── scripts/
│   └── setup_database.sql     # Script de inicialización de BD
│
├── Cargo.toml                 # Dependencias y configuración del proyecto
├── .env                       # Variables de entorno
└── README.md                  # Documentación del proyecto
```

### Descripción de Módulos

#### **src/main.rs**
- Configuración del servidor HTTP
- Definición de rutas
- Configuración de middleware (CORS, tracing)
- Documentación OpenAPI
- Inicialización de la aplicación

#### **src/models/alumno.rs**
- `Alumno`: Estructura principal que representa un alumno
- `CreateAlumnoRequest`: DTO para creación de alumnos
- `UpdateAlumnoRequest`: DTO para actualización de alumnos
- `AlumnoResponse`: Respuesta para operaciones individuales
- `AlumnosResponse`: Respuesta para listas de alumnos
- `ErrorResponse`: Estructura para manejo de errores

#### **src/handlers/alumnos.rs**
- `get_alumnos`: Obtener lista con paginación y filtros
- `get_alumno`: Obtener alumno por ID
- `create_alumno`: Crear nuevo alumno
- `update_alumno`: Actualizar alumno existente
- `delete_alumno`: Eliminar alumno

#### **src/database/connection.rs**
- Configuración del pool de conexiones
- Gestión de conexiones a MySQL
- Verificación de conectividad

## 🚀 Instalación y Configuración

### Prerrequisitos

1. **Rust**: Versión 1.89.0 o superior
```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Verificar instalación
rustc --version
cargo --version
```

2. **MySQL**: Servidor MySQL 8.0 o superior
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Verificar instalación
mysql --version
sudo systemctl status mysql
```

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd rust-api-rest
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```properties
DATABASE_URL=mysql://root:@localhost:3306/alumnos_db
RUST_LOG=debug
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
```

3. **Instalar dependencias**
```bash
cargo build
```

## 🗄️ Base de Datos

### Configuración de MySQL

1. **Iniciar servicio MySQL**
```bash
sudo systemctl start mysql
sudo mysql_secure_installation  # Opcional: configuración segura
```

2. **Ejecutar script de inicialización**
```bash
# Opción 1: Desde línea de comandos
mysql -u root -p < scripts/setup_database.sql

# Opción 2: Desde cliente MySQL
mysql -u root -p
source /path/to/scripts/setup_database.sql
```

### Esquema de Base de Datos

#### Tabla: `alumnos`

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `nombre` | VARCHAR(100) | Nombre del alumno | NOT NULL, 2-100 caracteres |
| `apellido` | VARCHAR(100) | Apellido del alumno | NOT NULL, 2-100 caracteres |
| `email` | VARCHAR(150) | Email del alumno | UNIQUE, NOT NULL, formato email |
| `edad` | INT | Edad del alumno | NOT NULL, 16-65 años |
| `carrera` | VARCHAR(100) | Carrera del alumno | NOT NULL, 5-100 caracteres |
| `semestre` | INT | Semestre actual | NOT NULL, 1-10 semestres |
| `promedio` | DOUBLE | Promedio académico | DEFAULT 0.00, 0.00-10.00 |
| `activo` | BOOLEAN | Estatus del alumno | DEFAULT TRUE |
| `fecha_registro` | DATETIME | Fecha de registro | DEFAULT CURRENT_TIMESTAMP |
| `fecha_actualizacion` | DATETIME | Última actualización | ON UPDATE CURRENT_TIMESTAMP |

#### Índices para Optimización
- `idx_email`: Índice único en email
- `idx_carrera`: Índice en carrera para filtros
- `idx_activo`: Índice en estatus activo
- `idx_fecha_registro`: Índice en fecha de registro

## 🎯 Uso de la API

### Iniciar el Servidor

```bash
# Desarrollo
cargo run

# Producción (optimizado)
cargo build --release
./target/release/rust-api-rest
```

Salida esperada:
```
🔗 Conectando a la base de datos...
✅ Conexión a MySQL establecida correctamente
🚀 Servidor iniciado en http://0.0.0.0:3000
📚 Documentación Swagger disponible en http://0.0.0.0:3000/swagger-ui
🏥 Health check disponible en http://0.0.0.0:3000/health
```

### URLs Importantes

- **API Base**: `http://localhost:3000/api`
- **Swagger UI**: `http://localhost:3000/swagger-ui`
- **Health Check**: `http://localhost:3000/health`
- **OpenAPI JSON**: `http://localhost:3000/api-docs/openapi.json`

## 📡 Endpoints

### 🏥 Health Check

#### `GET /health`
Verificar el estado del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "API de Alumnos funcionando correctamente",
  "timestamp": "2025-09-11T06:00:00.000Z",
  "version": "1.0.0"
}
```

### 👥 Gestión de Alumnos

#### `GET /api/alumnos`
Obtener lista de alumnos con paginación y filtros.

**Parámetros de consulta:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, máx: 100)
- `search` (opcional): Búsqueda por nombre o apellido
- `carrera` (opcional): Filtrar por carrera específica
- `activo` (opcional): Filtrar por estatus activo (true/false)

**Ejemplos:**
```bash
# Obtener todos los alumnos (primera página)
curl "http://localhost:3000/api/alumnos"

# Paginación
curl "http://localhost:3000/api/alumnos?page=2&limit=5"

# Búsqueda por nombre
curl "http://localhost:3000/api/alumnos?search=Juan"

# Filtrar por carrera
curl "http://localhost:3000/api/alumnos?carrera=Ingeniería%20en%20Sistemas"

# Filtrar activos con paginación
curl "http://localhost:3000/api/alumnos?activo=true&page=1&limit=10"

# Combinación de filtros
curl "http://localhost:3000/api/alumnos?search=Ana&carrera=Ingeniería%20Civil&activo=true"
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Alumnos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@email.com",
      "edad": 20,
      "carrera": "Ingeniería en Sistemas",
      "semestre": 4,
      "promedio": 8.5,
      "activo": true,
      "fecha_registro": "2025-09-11T00:00:00Z",
      "fecha_actualizacion": "2025-09-11T00:00:00Z"
    }
  ],
  "total": 1
}
```

#### `GET /api/alumnos/{id}`
Obtener un alumno específico por ID.

**Ejemplo:**
```bash
curl "http://localhost:3000/api/alumnos/1"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Alumno encontrado",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@email.com",
    "edad": 20,
    "carrera": "Ingeniería en Sistemas",
    "semestre": 4,
    "promedio": 8.5,
    "activo": true,
    "fecha_registro": "2025-09-11T00:00:00Z",
    "fecha_actualizacion": "2025-09-11T00:00:00Z"
  }
}
```

**Respuesta no encontrado (404):**
```json
{
  "success": false,
  "message": "Alumno no encontrado",
  "errors": null
}
```

#### `POST /api/alumnos`
Crear un nuevo alumno.

**Body (JSON):**
```json
{
  "nombre": "María",
  "apellido": "González",
  "email": "maria.gonzalez@email.com",
  "edad": 22,
  "carrera": "Ingeniería Industrial",
  "semestre": 6,
  "promedio": 9.0
}
```

**Ejemplo con curl:**
```bash
curl -X POST "http://localhost:3000/api/alumnos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "González",
    "email": "maria.gonzalez@email.com",
    "edad": 22,
    "carrera": "Ingeniería Industrial",
    "semestre": 6,
    "promedio": 9.0
  }'
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Alumno creado exitosamente",
  "data": {
    "id": 21,
    "nombre": "María",
    "apellido": "González",
    "email": "maria.gonzalez@email.com",
    "edad": 22,
    "carrera": "Ingeniería Industrial",
    "semestre": 6,
    "promedio": 9.0,
    "activo": true,
    "fecha_registro": "2025-09-11T06:00:00Z",
    "fecha_actualizacion": "2025-09-11T06:00:00Z"
  }
}
```

#### `PUT /api/alumnos/{id}`
Actualizar un alumno existente (actualización parcial).

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "nombre": "María Actualizada",
  "apellido": "González Martínez",
  "email": "maria.nueva@email.com",
  "edad": 23,
  "carrera": "Ingeniería en Sistemas",
  "semestre": 7,
  "promedio": 9.5,
  "activo": false
}
```

**Ejemplo con curl:**
```bash
curl -X PUT "http://localhost:3000/api/alumnos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "promedio": 9.5,
    "semestre": 7
  }'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Alumno actualizado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@email.com",
    "edad": 20,
    "carrera": "Ingeniería en Sistemas",
    "semestre": 7,
    "promedio": 9.5,
    "activo": true,
    "fecha_registro": "2025-09-11T00:00:00Z",
    "fecha_actualizacion": "2025-09-11T06:00:00Z"
  }
}
```

#### `DELETE /api/alumnos/{id}`
Eliminar un alumno.

**Ejemplo:**
```bash
curl -X DELETE "http://localhost:3000/api/alumnos/1"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Alumno eliminado exitosamente",
  "data": null
}
```

## 🏗️ Modelos de Datos

### Estructura Principal: `Alumno`

```rust
#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct Alumno {
    pub id: i32,                        // ID único del alumno
    pub nombre: String,                 // Nombre del alumno
    pub apellido: String,               // Apellido del alumno
    pub email: String,                  // Email único del alumno
    pub edad: i32,                      // Edad del alumno
    pub carrera: String,                // Carrera que estudia
    pub semestre: i32,                  // Semestre actual
    pub promedio: f64,                  // Promedio académico
    pub activo: bool,                   // Estatus activo/inactivo
    pub fecha_registro: DateTime<Utc>,  // Fecha de registro
    pub fecha_actualizacion: DateTime<Utc>, // Última actualización
}
```

### DTOs (Data Transfer Objects)

#### `CreateAlumnoRequest`
```rust
#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct CreateAlumnoRequest {
    #[validate(length(min = 2, max = 100))]
    pub nombre: String,
    
    #[validate(length(min = 2, max = 100))]
    pub apellido: String,
    
    #[validate(email)]
    pub email: String,
    
    #[validate(range(min = 16, max = 65))]
    pub edad: i32,
    
    #[validate(length(min = 5, max = 100))]
    pub carrera: String,
    
    #[validate(range(min = 1, max = 10))]
    pub semestre: i32,
    
    #[validate(range(min = 0.0, max = 10.0))]
    pub promedio: Option<f64>,  // Opcional, default: 0.0
}
```

#### `UpdateAlumnoRequest`
```rust
#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateAlumnoRequest {
    // Todos los campos son Optional para updates parciales
    #[validate(length(min = 2, max = 100))]
    pub nombre: Option<String>,
    
    #[validate(length(min = 2, max = 100))]
    pub apellido: Option<String>,
    
    #[validate(email)]
    pub email: Option<String>,
    
    #[validate(range(min = 16, max = 65))]
    pub edad: Option<i32>,
    
    #[validate(length(min = 5, max = 100))]
    pub carrera: Option<String>,
    
    #[validate(range(min = 1, max = 10))]
    pub semestre: Option<i32>,
    
    #[validate(range(min = 0.0, max = 10.0))]
    pub promedio: Option<f64>,
    
    pub activo: Option<bool>,
}
```

### Respuestas de la API

#### `AlumnoResponse` - Respuesta Individual
```rust
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct AlumnoResponse {
    pub success: bool,           // Indica si la operación fue exitosa
    pub message: String,         // Mensaje descriptivo
    pub data: Option<Alumno>,    // Datos del alumno (null en caso de error)
}
```

#### `AlumnosResponse` - Respuesta de Lista
```rust
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct AlumnosResponse {
    pub success: bool,           // Indica si la operación fue exitosa
    pub message: String,         // Mensaje descriptivo
    pub data: Vec<Alumno>,       // Lista de alumnos
    pub total: i64,              // Total de registros (para paginación)
}
```

#### `ErrorResponse` - Respuesta de Error
```rust
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ErrorResponse {
    pub success: bool,                    // Siempre false para errores
    pub message: String,                  // Mensaje de error principal
    pub errors: Option<Vec<String>>,      // Detalles adicionales de errores
}
```

## ✅ Validaciones

### Validaciones Implementadas

#### **Nombre y Apellido**
- **Longitud**: Entre 2 y 100 caracteres
- **Mensaje**: "Nombre/Apellido debe tener entre 2 y 100 caracteres"

#### **Email**
- **Formato**: Formato de email válido
- **Unicidad**: Debe ser único en la base de datos
- **Mensaje**: "Email inválido" o "El email ya existe"

#### **Edad**
- **Rango**: Entre 16 y 65 años
- **Mensaje**: "Edad debe estar entre 16 y 65 años"

#### **Carrera**
- **Longitud**: Entre 5 y 100 caracteres
- **Mensaje**: "Carrera debe tener entre 5 y 100 caracteres"

#### **Semestre**
- **Rango**: Entre 1 y 10 semestres
- **Mensaje**: "Semestre debe estar entre 1 y 10"

#### **Promedio**
- **Rango**: Entre 0.0 y 10.0
- **Mensaje**: "Promedio debe estar entre 0.0 y 10.0"

### Ejemplo de Respuesta de Validación

```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    "Email inválido",
    "Edad debe estar entre 16 y 65 años",
    "Promedio debe estar entre 0.0 y 10.0"
  ]
}
```

## 📖 Documentación Swagger

### Acceso a Swagger UI

Navega a: `http://localhost:3000/swagger-ui`

### Características de la Documentación

- **Interfaz Interactiva**: Prueba endpoints directamente desde el navegador
- **Esquemas Automáticos**: Documentación automática de modelos de datos
- **Validaciones Visibles**: Especificaciones de validación en la documentación
- **Códigos de Respuesta**: Todos los códigos de respuesta documentados
- **Ejemplos**: Ejemplos de requests y responses

### Configuración OpenAPI

```rust
#[derive(OpenApi)]
#[openapi(
    paths(
        rust_api_rest::handlers::get_alumnos,
        rust_api_rest::handlers::get_alumno,
        rust_api_rest::handlers::create_alumno,
        rust_api_rest::handlers::update_alumno,
        rust_api_rest::handlers::delete_alumno,
    ),
    components(schemas(
        Alumno,
        CreateAlumnoRequest,
        UpdateAlumnoRequest,
        AlumnoResponse,
        AlumnosResponse,
        ErrorResponse
    )),
    info(
        title = "API REST de Alumnos",
        description = "API completa para la gestión de alumnos con operaciones CRUD",
        version = "1.0.0"
    )
)]
struct ApiDoc;
```

## ⚙️ Comandos de Rust

### Comandos Básicos

#### **Crear Proyecto**
```bash
cargo new rust-api-rest
cd rust-api-rest
```

#### **Gestión de Dependencias**
```bash
# Añadir dependencia
cargo add axum

# Añadir dependencia con features
cargo add sqlx --features runtime-tokio-rustls,mysql,chrono

# Actualizar dependencias
cargo update
```

#### **Compilación**
```bash
# Compilación de desarrollo (no optimizada)
cargo build

# Compilación optimizada para producción
cargo build --release

# Compilación con verificación (sin generar binario)
cargo check
```

#### **Ejecución**
```bash
# Ejecutar en modo desarrollo
cargo run

# Ejecutar con logs de debug
RUST_LOG=debug cargo run

# Ejecutar binario optimizado
./target/release/rust-api-rest
```

#### **Testing**
```bash
# Ejecutar tests
cargo test

# Ejecutar tests con salida verbosa
cargo test -- --nocapture

# Ejecutar test específico
cargo test test_create_alumno
```

#### **Documentación**
```bash
# Generar documentación del proyecto
cargo doc

# Generar y abrir documentación
cargo doc --open
```

#### **Linting y Formatting**
```bash
# Formatear código
cargo fmt

# Verificar formato
cargo fmt --check

# Linting con Clippy
cargo clippy

# Clippy con sugerencias adicionales
cargo clippy -- -W clippy::all
```

#### **Limpieza**
```bash
# Limpiar archivos compilados
cargo clean

# Limpiar dependencias descargadas
cargo clean --package rust-api-rest
```

### Comandos Específicos del Proyecto

#### **Variables de Entorno**
```bash
# Ejecutar con variables de entorno específicas
DATABASE_URL=mysql://user:pass@localhost/db cargo run

# Cargar desde archivo .env
dotenv cargo run
```

#### **Debugging**
```bash
# Ejecutar con debugging detallado
RUST_BACKTRACE=1 cargo run

# Ejecutar con debugging completo
RUST_BACKTRACE=full cargo run

# Logs específicos
RUST_LOG=rust_api_rest=debug,sqlx=info cargo run
```

## 🏛️ Arquitectura y Funcionamiento

### Patrón de Arquitectura

El proyecto sigue una **arquitectura en capas (Layered Architecture)** común en aplicaciones web:

```
┌─────────────────────────────────────┐
│            HTTP Layer               │
│    (Axum Router, Middleware)        │
├─────────────────────────────────────┤
│           Handler Layer             │
│    (Controllers, Request/Response)  │
├─────────────────────────────────────┤
│           Service Layer             │
│    (Business Logic, Validation)     │
├─────────────────────────────────────┤
│         Data Access Layer          │
│    (SQLx, Database Operations)      │
├─────────────────────────────────────┤
│          Database Layer            │
│         (MySQL Database)           │
└─────────────────────────────────────┘
```

### Flujo de Request/Response

#### 1. **Request Processing**
```
HTTP Request → Axum Router → Middleware → Handler → Validation → Database → Response
```

#### 2. **Detalles del Flujo**

1. **HTTP Request**: Cliente envía petición HTTP
2. **Axum Router**: Determina qué handler debe procesar la request
3. **Middleware**: Aplica CORS, logging, autenticación
4. **Handler**: Extrae datos de la request (Path, Query, Body)
5. **Validation**: Valida datos usando validator crate
6. **Database**: Ejecuta operaciones en MySQL usando SQLx
7. **Response**: Serializa respuesta a JSON y envía al cliente

### Gestión de Conexiones

#### **Connection Pooling**
```rust
pub async fn create_connection_pool(database_url: &str) -> Result<DbPool> {
    let pool = MySqlPool::connect_with(database_url.parse()?).await?;
    // Pool automáticamente gestiona conexiones
    Ok(pool)
}
```

**Ventajas del Connection Pool:**
- **Reutilización**: Las conexiones se reutilizan
- **Límites**: Control de conexiones concurrentes
- **Performance**: Evita overhead de crear/cerrar conexiones
- **Resilencia**: Manejo automático de conexiones fallidas

### Manejo de Estados

#### **Application State**
```rust
// El pool se comparte entre todos los handlers
let api_routes = Router::new()
    .route("/alumnos", get(get_alumnos))
    .with_state(pool);  // Estado compartido
```

#### **Request State**
```rust
// Cada handler recibe acceso al pool
pub async fn get_alumnos(
    State(pool): State<Pool<MySql>>,  // Extractor de estado
    Query(params): Query<PaginationQuery>,
) -> Result<Json<AlumnosResponse>, (StatusCode, Json<ErrorResponse>)>
```

### Extractors en Axum

#### **Tipos de Extractors**

1. **Path**: Extrae parámetros de la URL
```rust
Path(id): Path<i32>  // /alumnos/{id}
```

2. **Query**: Extrae parámetros de query string
```rust
Query(params): Query<PaginationQuery>  // ?page=1&limit=10
```

3. **Json**: Extrae y deserializa body JSON
```rust
Json(payload): Json<CreateAlumnoRequest>
```

4. **State**: Accede al estado de la aplicación
```rust
State(pool): State<Pool<MySql>>
```

### Serialización/Deserialización

#### **Proceso Automático**
```rust
// Request: JSON → Rust Struct
#[derive(Deserialize)]
pub struct CreateAlumnoRequest { ... }

// Response: Rust Struct → JSON
#[derive(Serialize)]
pub struct AlumnoResponse { ... }
```

#### **Configuraciones Avanzadas**
```rust
#[derive(Serialize, Deserialize)]
pub struct Alumno {
    #[serde(rename = "studentId")]
    pub id: i32,
    
    #[serde(skip_serializing_if = "Option::is_none")]
    pub optional_field: Option<String>,
}
```

### Manejo de Errores

#### **Estrategia de Error Handling**

```rust
// Custom error type
pub type Result<T> = std::result::Result<T, ApiError>;

// Error conversion automática
impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        // Convierte errores de SQLx a errores de API
    }
}
```

#### **Propagación de Errores**
```rust
// El operador ? propaga errores automáticamente
let alumno = sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
    .bind(id)
    .fetch_optional(&pool)
    .await?;  // Propagación automática
```

### Async/Await Pattern

#### **Operaciones No Bloqueantes**
```rust
// Todas las operaciones I/O son async
pub async fn get_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    // .await no bloquea el hilo
    let alumno = sqlx::query_as::<_, Alumno>("...")
        .bind(id)
        .fetch_optional(&pool)
        .await?;
    
    // Procesamiento continúa...
}
```

**Beneficios:**
- **Concurrencia**: Múltiples requests simultáneas
- **Eficiencia**: Un hilo maneja miles de connections
- **Escalabilidad**: Mejor uso de recursos del sistema

## 💡 Ejemplos de Uso

### Escenarios Comunes

#### **1. Registrar Nuevo Alumno**
```bash
curl -X POST "http://localhost:3000/api/alumnos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Andrea",
    "apellido": "Martínez",
    "email": "andrea.martinez@university.edu",
    "edad": 19,
    "carrera": "Ingeniería de Software",
    "semestre": 3,
    "promedio": 8.7
  }'
```

#### **2. Buscar Alumnos por Carrera**
```bash
curl "http://localhost:3000/api/alumnos?carrera=Ingeniería%20en%20Sistemas&activo=true"
```

#### **3. Actualizar Promedio de Alumno**
```bash
curl -X PUT "http://localhost:3000/api/alumnos/5" \
  -H "Content-Type: application/json" \
  -d '{
    "promedio": 9.2,
    "semestre": 8
  }'
```

#### **4. Buscar Alumnos con Paginación**
```bash
curl "http://localhost:3000/api/alumnos?page=2&limit=5&search=Ana"
```

#### **5. Desactivar Alumno (Soft Delete)**
```bash
curl -X PUT "http://localhost:3000/api/alumnos/10" \
  -H "Content-Type: application/json" \
  -d '{"activo": false}'
```

### Usando desde JavaScript/Frontend

#### **Fetch API Example**
```javascript
// Obtener lista de alumnos
async function getAlumnos(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/alumnos?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    
    if (data.success) {
      console.log('Alumnos:', data.data);
      console.log('Total:', data.total);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Crear nuevo alumno
async function createAlumno(alumnoData) {
  try {
    const response = await fetch('http://localhost:3000/api/alumnos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alumnoData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Alumno creado:', data.data);
    } else {
      console.error('Errores de validación:', data.errors);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

#### **Axios Example**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

// Servicios
export const alumnosService = {
  getAll: (params) => api.get('/alumnos', { params }),
  getById: (id) => api.get(`/alumnos/${id}`),
  create: (data) => api.post('/alumnos', data),
  update: (id, data) => api.put(`/alumnos/${id}`, data),
  delete: (id) => api.delete(`/alumnos/${id}`)
};
```

## 🔧 Troubleshooting

### Problemas Comunes y Soluciones

#### **1. Error de Conexión a MySQL**
```
Error: error connecting to database: Connection refused
```

**Soluciones:**
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql
sudo systemctl start mysql

# Verificar conexión manual
mysql -u root -p -h localhost

# Verificar variables de entorno
echo $DATABASE_URL
```

#### **2. Error de Compilación por Dependencias**
```
failed to resolve: use of unresolved module
```

**Soluciones:**
```bash
# Limpiar cache y recompilar
cargo clean
cargo build

# Verificar Cargo.toml
cargo check
```

#### **3. Puerto Ocupado**
```
Address already in use (os error 98)
```

**Soluciones:**
```bash
# Encontrar proceso usando el puerto
sudo lsof -i :3000
sudo kill -9 <PID>

# Cambiar puerto en .env
SERVER_PORT=3001
```

#### **4. Errores de Validación Inesperados**
```json
{
  "success": false,
  "message": "Datos de entrada inválidos"
}
```

**Verificaciones:**
- Validar formato JSON del request
- Verificar que todos los campos requeridos estén presentes
- Comprobar rangos de valores (edad: 16-65, semestre: 1-10, etc.)
- Verificar formato de email

#### **5. Errores de Base de Datos**
```
Table 'alumnos_db.alumnos' doesn't exist
```

**Soluciones:**
```bash
# Ejecutar script de setup
mysql -u root -p < scripts/setup_database.sql

# Verificar base de datos
mysql -u root -p
USE alumnos_db;
SHOW TABLES;
DESCRIBE alumnos;
```

#### **6. Problemas de CORS en Frontend**
```
Access to fetch blocked by CORS policy
```

**Verificación:**
- Confirmar que el servidor incluye headers CORS
- Verificar configuración en `main.rs`:
```rust
let cors = CorsLayer::new()
    .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
    .allow_headers([CONTENT_TYPE, AUTHORIZATION, ACCEPT]);
```

### Logging y Debugging

#### **Habilitar Logs Detallados**
```bash
# Logs de la aplicación
RUST_LOG=rust_api_rest=debug cargo run

# Logs de SQLx
RUST_LOG=sqlx=debug cargo run

# Logs combinados
RUST_LOG=rust_api_rest=debug,sqlx=info,tower_http=debug cargo run
```

#### **Debugging con Backtrace**
```bash
# Backtrace básico
RUST_BACKTRACE=1 cargo run

# Backtrace completo
RUST_BACKTRACE=full cargo run
```

### Monitoreo en Producción

#### **Health Checks**
```bash
# Verificar estado del servidor
curl http://localhost:3000/health

# Verificar conectividad de base de datos
curl http://localhost:3000/api/alumnos?limit=1
```

#### **Métricas de Performance**
```bash
# Tiempo de respuesta
time curl http://localhost:3000/api/alumnos

# Carga concurrente (usando ab)
ab -n 1000 -c 10 http://localhost:3000/health
```

---

## 🎓 Conclusión

Este proyecto demuestra el poder y la elegancia de Rust para el desarrollo de APIs REST modernas. A través de la implementación de este sistema de gestión de alumnos, hemos explorado:

### **Aprendizajes Clave sobre Rust**

1. **Memory Safety**: Rust garantiza seguridad de memoria sin garbage collector
2. **Type System**: El sistema de tipos previene errores en tiempo de compilación
3. **Performance**: Rendimiento comparable a C/C++ con seguridad de alto nivel
4. **Async Programming**: Manejo eficiente de concurrencia con async/await
5. **Ecosystem**: Rica colección de crates para desarrollo web

### **Tecnologías Modernas**

- **Axum**: Framework web moderno y performante
- **SQLx**: Type-safe database interactions
- **Serde**: Serialización/deserialización eficiente
- **Utoipa**: Documentación automática OpenAPI
- **Validator**: Validaciones declarativas

### **Próximos Pasos**

Para expandir este proyecto, considera implementar:

- **Autenticación JWT**: Sistema de login y autorización
- **Testing**: Unit tests y integration tests completos
- **Caching**: Redis para cache de consultas frecuentes
- **Rate Limiting**: Protección contra abuso de API
- **Deployment**: Containerización con Docker
- **Monitoring**: Métricas con Prometheus/Grafana
- **Frontend**: Aplicación React/Vue.js que consuma la API

### **Recursos Adicionales**

- [Documentación Oficial de Rust](https://doc.rust-lang.org/)
- [Axum Framework](https://github.com/tokio-rs/axum)
- [SQLx Documentation](https://github.com/launchbadge/sqlx)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)

Este proyecto sirve como base sólida para entender el desarrollo web con Rust y puede ser extendido para aplicaciones empresariales reales.

---

**Desarrollado con ❤️ y ⚡ Rust**