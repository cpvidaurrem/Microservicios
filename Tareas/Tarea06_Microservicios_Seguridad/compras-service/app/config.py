"""
Configuración centralizada del servicio de compras
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración del servicio"""
    
    # Aplicación
    app_name: str = "Servicio de Compras"
    app_version: str = "1.0.0"
    node_env: str = "development"
    port: int = 3002
    
    # Base de datos PostgreSQL
    database_url: str
    
    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    
    # Servicios externos
    eventos_service_url: str
    usuarios_service_url: str
    
    #  RabbitMQ
    rabbitmq_url: str = "amqp://guest:guest@localhost:5672"
    rabbitmq_queue: str = "notificaciones_compras"
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Obtiene configuración singleton"""
    return Settings()


settings = get_settings()