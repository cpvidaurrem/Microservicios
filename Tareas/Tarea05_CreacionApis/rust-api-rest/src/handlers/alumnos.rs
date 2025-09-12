use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
};
use sqlx::{MySql, Pool};
use validator::Validate;

use crate::models::*;

/// GET /api/alumnos - Obtener alumnos con paginación y filtros
#[utoipa::path(
    get,
    path = "/api/alumnos",
    params(
        ("page" = Option<i32>, Query, description = "Número de página (default: 1)"),
        ("limit" = Option<i32>, Query, description = "Elementos por página (default: 10)"),
        ("search" = Option<String>, Query, description = "Búsqueda por nombre o apellido"),
        ("carrera" = Option<String>, Query, description = "Filtrar por carrera"),
        ("activo" = Option<bool>, Query, description = "Filtrar por estatus activo")
    ),
    responses(
        (status = 200, description = "Lista de alumnos", body = AlumnosResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn get_alumnos(
    State(pool): State<Pool<MySql>>,     
    Query(params): Query<PaginationQuery>, // Extractor de query parameters
) -> Result<Json<AlumnosResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Calcular paginación con valores por defecto y límites
    let page = params.page.unwrap_or(1).max(1);
    let limit = params.limit.unwrap_or(10).min(100).max(1);
    let offset = (page - 1) * limit;

    // Construir queries dinámicamente basado en filtros
    let mut query = "SELECT * FROM alumnos WHERE 1=1".to_string();
    let mut count_query = "SELECT COUNT(*) as total FROM alumnos WHERE 1=1".to_string();
    
    // Agregar filtro de búsqueda si se proporciona
    if let Some(search) = &params.search {
        let search_condition = format!(" AND (nombre LIKE '%{}%' OR apellido LIKE '%{}%')", search, search);
        query.push_str(&search_condition);
        count_query.push_str(&search_condition);
    }
    
    // Agregar filtro por carrera
    if let Some(carrera) = &params.carrera {
        let carrera_condition = format!(" AND carrera = '{}'", carrera);
        query.push_str(&carrera_condition);
        count_query.push_str(&carrera_condition);
    }
    
    // Agregar filtro por estado activo
    if let Some(activo) = params.activo {
        let activo_condition = format!(" AND activo = {}", activo);
        query.push_str(&activo_condition);
        count_query.push_str(&activo_condition);
    }

    // Agregar ordenamiento y paginación
    query.push_str(" ORDER BY fecha_registro DESC");
    query.push_str(&format!(" LIMIT {} OFFSET {}", limit, offset));

    // Ejecutar query principal para obtener alumnos
    match sqlx::query_as::<_, Alumno>(&query).fetch_all(&pool).await {
        Ok(alumnos) => {
            // Ejecutar query de conteo para total de registros
            let total: (i64,) = sqlx::query_as(&count_query).fetch_one(&pool).await
                .unwrap_or((0,));

            Ok(Json(AlumnosResponse {
                success: true,
                message: "Alumnos obtenidos exitosamente".to_string(),
                data: alumnos,
                total: total.0,
            }))
        }
        Err(e) => {
            tracing::error!("Error al obtener alumnos: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// POST /api/alumnos - Crear nuevo alumno
#[utoipa::path(
    post,
    path = "/api/alumnos",
    request_body = CreateAlumnoRequest,
    responses(
        (status = 201, description = "Alumno creado exitosamente", body = AlumnoResponse),
        (status = 400, description = "Datos inválidos", body = ErrorResponse),
        (status = 409, description = "Email ya existe", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn create_alumno(
    State(pool): State<Pool<MySql>>,           // Pool 
    Json(payload): Json<CreateAlumnoRequest>,  // Deserialización automática del JSON
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Validar datos usando las reglas definidas en el struct
    if let Err(errors) = payload.validate() {
        let error_messages: Vec<String> = errors
            .field_errors()
            .into_iter()
            .flat_map(|(_, v)| v.into_iter().map(|e| e.message.as_ref().unwrap().to_string()))
            .collect();

        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                success: false,
                message: "Datos de entrada inválidos".to_string(),
                errors: Some(error_messages),
            }),
        ));
    }

    // Usar valor por defecto para promedio si no se proporciona
    let promedio = payload.promedio.unwrap_or(0.0);

    // Prepared statement para prevenir SQL injection
    let query = r#"
        INSERT INTO alumnos (nombre, apellido, email, edad, carrera, semestre, promedio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    "#;

    // Ejecutar insert con parámetros bindeados
    match sqlx::query(query)
        .bind(&payload.nombre)
        .bind(&payload.apellido)
        .bind(&payload.email)
        .bind(payload.edad)
        .bind(&payload.carrera)
        .bind(payload.semestre)
        .bind(promedio)
        .execute(&pool)
        .await
    {
        Ok(result) => {
            // Obtener ID del registro insertado
            let alumno_id = result.last_insert_id() as i32;

            // Fetch del alumno recién creado para retornarlo
            match sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
                .bind(alumno_id)
                .fetch_one(&pool)
                .await
            {
                Ok(alumno) => Ok(Json(AlumnoResponse {
                    success: true,
                    message: "Alumno creado exitosamente".to_string(),
                    data: Some(alumno),
                })),
                Err(e) => {
                    tracing::error!("Error al obtener alumno creado: {}", e);
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ErrorResponse {
                            success: false,
                            message: "Error interno del servidor".to_string(),
                            errors: Some(vec![e.to_string()]),
                        }),
                    ))
                }
            }
        }
        // Manejo específico de violación de constraint único (email duplicado)
        Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
            Err((
                StatusCode::CONFLICT,
                Json(ErrorResponse {
                    success: false,
                    message: "El email ya existe".to_string(),
                    errors: None,
                }),
            ))
        }
        Err(e) => {
            tracing::error!("Error al crear alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// PUT /api/alumnos/{id} - Actualizar alumno existente
#[utoipa::path(
    put,
    path = "/api/alumnos/{id}",
    params(
        ("id" = i32, Path, description = "ID del alumno")
    ),
    request_body = UpdateAlumnoRequest,
    responses(
        (status = 200, description = "Alumno actualizado exitosamente", body = AlumnoResponse),
        (status = 400, description = "Datos inválidos", body = ErrorResponse),
        (status = 404, description = "Alumno no encontrado", body = ErrorResponse),
        (status = 409, description = "Email ya existe", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn update_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,                      
    Json(payload): Json<UpdateAlumnoRequest>,
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Validar datos de entrada
    if let Err(errors) = payload.validate() {
        let error_messages: Vec<String> = errors
            .field_errors()
            .into_iter()
            .flat_map(|(_, v)| v.into_iter().map(|e| e.message.as_ref().unwrap().to_string()))
            .collect();

        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                success: false,
                message: "Datos de entrada inválidos".to_string(),
                errors: Some(error_messages),
            }),
        ));
    }

    // Verificar que el alumno existe antes de actualizar
    let existing_alumno = sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await;

    match existing_alumno {
        Ok(Some(_)) => {}
        Ok(None) => {
            return Err((
                StatusCode::NOT_FOUND,
                Json(ErrorResponse {
                    success: false,
                    message: "Alumno no encontrado".to_string(),
                    errors: None,
                }),
            ))
        }
        Err(e) => {
            tracing::error!("Error al verificar alumno: {}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ));
        }
    }

    // Construir query UPDATE dinámicamente - solo campos proporcionados
    let mut query_builder = sqlx::QueryBuilder::new("UPDATE alumnos SET ");
    let mut has_updates = false;

    // Agregar cada campo solo si está presente en el payload
    if let Some(nombre) = &payload.nombre {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("nombre = ").push_bind(nombre);
        has_updates = true;
    }
    
    if let Some(apellido) = &payload.apellido {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("apellido = ").push_bind(apellido);
        has_updates = true;
    }
    
    if let Some(email) = &payload.email {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("email = ").push_bind(email);
        has_updates = true;
    }
    
    if let Some(edad) = payload.edad {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("edad = ").push_bind(edad);
        has_updates = true;
    }
    
    if let Some(carrera) = &payload.carrera {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("carrera = ").push_bind(carrera);
        has_updates = true;
    }
    
    if let Some(semestre) = payload.semestre {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("semestre = ").push_bind(semestre);
        has_updates = true;
    }
    
    if let Some(promedio) = payload.promedio {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("promedio = ").push_bind(promedio);
        has_updates = true;
    }
    
    // Campo activo - tipo bool se maneja correctamente
    if let Some(activo) = payload.activo {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("activo = ").push_bind(activo); 
        has_updates = true;
    }

    // Validar que al menos un campo se proporcionó para actualizar
    if !has_updates {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                success: false,
                message: "No hay campos para actualizar".to_string(),
                errors: None,
            }),
        ));
    }

    // Agregar WHERE clause
    query_builder.push(" WHERE id = ").push_bind(id);

    // Ejecutar update
    match query_builder.build().execute(&pool).await {
        Ok(result) => {
            // Verificar que se actualizó al menos una fila
            if result.rows_affected() == 0 {
                return Err((
                    StatusCode::NOT_FOUND,
                    Json(ErrorResponse {
                        success: false,
                        message: "Alumno no encontrado".to_string(),
                        errors: None,
                    }),
                ));
            }

            // Retornar el alumno actualizado
            match sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
                .bind(id)
                .fetch_one(&pool)
                .await
            {
                Ok(alumno) => Ok(Json(AlumnoResponse {
                    success: true,
                    message: "Alumno actualizado exitosamente".to_string(),
                    data: Some(alumno),
                })),
                Err(e) => {
                    tracing::error!("Error al obtener alumno actualizado: {}", e);
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ErrorResponse {
                            success: false,
                            message: "Error interno del servidor".to_string(),
                            errors: Some(vec![e.to_string()]),
                        }),
                    ))
                }
            }
        }
        // Manejo de constraint violation en updates (email duplicado)
        Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
            Err((
                StatusCode::CONFLICT,
                Json(ErrorResponse {
                    success: false,
                    message: "El email ya existe".to_string(),
                    errors: None,
                }),
            ))
        }
        Err(e) => {
            tracing::error!("Error al actualizar alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// Obtener un alumno por ID
#[utoipa::path(
    get,
    path = "/api/alumnos/{id}",
    params(
        ("id" = i32, Path, description = "ID del alumno")
    ),
    responses(
        (status = 200, description = "Alumno encontrado", body = AlumnoResponse),
        (status = 404, description = "Alumno no encontrado", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn get_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,  
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    match sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
        .bind(id)  
        .fetch_optional(&pool)
        .await
    {
        Ok(Some(alumno)) => Ok(Json(AlumnoResponse {
            success: true,
            message: "Alumno encontrado".to_string(),
            data: Some(alumno),
        })),
        Ok(None) => Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                success: false,
                message: "Alumno no encontrado".to_string(),
                errors: None,
            }),
        )),
        Err(e) => {
            tracing::error!("Error al obtener alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// Eliminar un alumno
#[utoipa::path(
    delete,
    path = "/api/alumnos/{id}",
    params(
        ("id" = i32, Path, description = "ID del alumno")
    ),
    responses(
        (status = 200, description = "Alumno eliminado exitosamente", body = AlumnoResponse),
        (status = 404, description = "Alumno no encontrado", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn delete_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,  // Cambiado de String a i32
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    match sqlx::query("DELETE FROM alumnos WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
    {
        Ok(result) => {
            if result.rows_affected() == 0 {
                Err((
                    StatusCode::NOT_FOUND,
                    Json(ErrorResponse {
                        success: false,
                        message: "Alumno no encontrado".to_string(),
                        errors: None,
                    }),
                ))
            } else {
                Ok(Json(AlumnoResponse {
                    success: true,
                    message: "Alumno eliminado exitosamente".to_string(),
                    data: None,
                }))
            }
        }
        Err(e) => {
            tracing::error!("Error al eliminar alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}