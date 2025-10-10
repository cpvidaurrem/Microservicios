"""
Aplicación FastAPI - Servicio de Compras
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.database import connect_db, disconnect_db
from app.routes import compras
from app.services.rabbitmq_client import rabbitmq_client 
from app.utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manejo del ciclo de vida de la aplicación"""
    # Startup
    logger.info(f"Iniciando {settings.app_name} v{settings.app_version}")
    await connect_db()
    await rabbitmq_client.conectar()  #  Conectar a RabbitMQ
    yield
    # Shutdown
    await rabbitmq_client.cerrar()  #  Cerrar conexión
    await disconnect_db()
    logger.info("Cerrando servicio de compras")


# Crear aplicación
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API REST para gestión de compra de entradas",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: especificar dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(compras.router)


@app.get("/", tags=["Health"])
async def root():
    """Endpoint raíz - health check"""
    return {
        "servicio": settings.app_name,
        "version": settings.app_version,
        "status": "ok",
        "endpoints": [
            "GET /docs - Documentación Swagger",
            "GET /api/compras/eventos - Listar eventos disponibles",
            "POST /api/compras/ - Crear compra",
            "GET /api/compras/mis-compras - Ver mis compras",
            "POST /api/compras/{id}/pagar - Confirmar pago"
        ]
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Manejador global de excepciones"""
    logger.error(f"Error no manejado: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Error interno del servidor",
            "type": "internal_server_error"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.node_env == "development"
    )