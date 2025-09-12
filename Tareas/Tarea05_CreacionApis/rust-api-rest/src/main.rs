use axum::{
    http::{
        header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
        HeaderValue, Method,
    },
    routing::{delete, get, post, put},
    Router,
};
use dotenv::dotenv;
use std::env;
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultMakeSpan, TraceLayer},
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::{
    OpenApi,
};
use utoipa_swagger_ui::SwaggerUi;

use rust_api_rest::{database::create_connection_pool, handlers::*, models::*};

// Define la documentación OpenAPI/Swagger automáticamente
#[derive(OpenApi)]
#[openapi(
    paths(
        // Lista todos los endpoints que se documentarán
        rust_api_rest::handlers::get_alumnos,
        rust_api_rest::handlers::get_alumno,
        rust_api_rest::handlers::create_alumno,
        rust_api_rest::handlers::update_alumno,
        rust_api_rest::handlers::delete_alumno,
    ),
    components(
        schemas(
            // Lista todos los modelos para el schema JSON
            Alumno,
            CreateAlumnoRequest,
            UpdateAlumnoRequest,
            AlumnoResponse,
            AlumnosResponse,
            ErrorResponse
        )
    ),
    tags(
        (name = "Alumnos", description = "API para gestión de alumnos")
    ),
    info(
        title = "API REST de Alumnos",
        description = "API completa para la gestión de alumnos con operaciones CRUD",
        version = "1.0.0",
        contact(
            name = "Desarrollador",
            email = "dev@example.com"
        ),
        license(
            name = "MIT",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers(
        (url = "http://localhost:3000", description = "Servidor de desarrollo")
    )
)]
struct ApiDoc;

#[tokio::main] // Macro que configura el runtime async de Tokio
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    // Configurar sistema de logging estructurado
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "rust_api_rest=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Obtener configuración desde variables de entorno con defaults
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://root:@localhost:3306/alumnos_db".to_string());
    let host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("SERVER_PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .unwrap_or(3000);

    // Crear pool de conexiones a MySQL - compartido entre todos los handlers
    tracing::info!("🔗 Conectando a la base de datos...");
    let pool = create_connection_pool(&database_url).await?;

    // Configurar CORS para permitir requests desde frontend
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
        .allow_origin("http://127.0.0.1:3000".parse::<HeaderValue>()?)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE, AUTHORIZATION, ACCEPT]);

    // Definir rutas de la API con sus handlers correspondientes
    let api_routes = Router::new()
        .route("/alumnos", get(get_alumnos))        
        .route("/alumnos", post(create_alumno))     
        .route("/alumnos/{id}", get(get_alumno))    
        .route("/alumnos/{id}", put(update_alumno)) 
        .route("/alumnos/{id}", delete(delete_alumno)) 
        .with_state(pool);

    // Crear aplicación principal con Swagger UI y middleware
    let app = Router::new()
        // Montar la UI de Swagger en /swagger-ui
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .nest("/api", api_routes) 
        .route("/", get(health_check))      
        .route("/health", get(health_check)) 
        .layer(
            ServiceBuilder::new()
                // Middleware de tracing para logging de requests
                .layer(TraceLayer::new_for_http().make_span_with(DefaultMakeSpan::default().include_headers(true)))
                .layer(cors), 
        );

    // Crear listener TCP y iniciar servidor
    let listener = tokio::net::TcpListener::bind(format!("{}:{}", host, port)).await?;
    
    tracing::info!("🚀 Servidor iniciado en http://{}:{}", host, port);
    tracing::info!("📚 Documentación Swagger disponible en http://{}:{}/swagger-ui", host, port);
    tracing::info!("🏥 Health check disponible en http://{}:{}/health", host, port);

    // Iniciar servidor HTTP
    axum::serve(listener, app).await?;

    Ok(())
}

// Endpoint de health check para monitoreo
async fn health_check() -> axum::response::Json<serde_json::Value> {
    axum::response::Json(serde_json::json!({
        "status": "ok",
        "message": "API de Alumnos funcionando correctamente",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "version": "1.0.0"
    }))
}