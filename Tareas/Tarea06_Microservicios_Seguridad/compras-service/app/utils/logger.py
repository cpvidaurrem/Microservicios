"""
Configuración de logging estructurado
"""
import logging
import sys
from pythonjsonlogger import jsonlogger
from app.config import settings


def setup_logger():
    """Configura el logger con formato JSON"""
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, settings.log_level.upper()))
    
    # Handler para consola
    handler = logging.StreamHandler(sys.stdout)
    
    # Formato JSON
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    )
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    
    return logger


logger = setup_logger()