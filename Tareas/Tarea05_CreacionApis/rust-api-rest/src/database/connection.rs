use anyhow::Result;
use sqlx::{MySql, MySqlPool, Pool};


pub type DbPool = Pool<MySql>;

/// Crea un pool de conexiones a MySQL con verificación de conectividad
pub async fn create_connection_pool(database_url: &str) -> Result<DbPool> {
    // Crear pool con configuración desde URL
    let pool = MySqlPool::connect_with(
        database_url.parse()?, // Parsear URL de conexión
    )
    .await?;

    // Verificar conectividad obteniendo una conexión del pool
    let _connection = pool.acquire().await?;
    tracing::info!("✅ Conexión a MySQL establecida correctamente");

    Ok(pool)
}