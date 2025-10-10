"""
Cliente HTTP para el servicio de Eventos (Rust)
"""
import httpx
from typing import Optional
from app.config import settings
from app.utils.logger import logger


class EventosClient:
    """Cliente para comunicarse con el servicio de Eventos"""
    
    def __init__(self):
        self.base_url = settings.eventos_service_url
    
    async def get_evento(self, evento_id: int) -> Optional[dict]:
        """
        Obtiene un evento por ID
        
        Args:
            evento_id: ID del evento
            
        Returns:
            dict con datos del evento o None si no existe
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/eventos/{evento_id}")
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    logger.warning(f"Evento {evento_id} no encontrado")
                    return None
                else:
                    logger.error(f"Error al obtener evento {evento_id}: {response.status_code}")
                    return None
                    
        except httpx.RequestError as e:
            logger.error(f"Error de conexión con servicio de Eventos: {str(e)}")
            return None
    
    async def listar_eventos(self) -> list:
        """
        Lista todos los eventos disponibles
        
        Returns:
            Lista de eventos
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/eventos")
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("eventos", [])
                else:
                    logger.error(f"Error al listar eventos: {response.status_code}")
                    return []
                    
        except httpx.RequestError as e:
            logger.error(f"Error de conexión con servicio de Eventos: {str(e)}")
            return []


eventos_client = EventosClient()