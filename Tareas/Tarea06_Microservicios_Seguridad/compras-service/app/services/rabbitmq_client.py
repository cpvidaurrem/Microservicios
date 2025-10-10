"""
Cliente RabbitMQ para publicar mensajes de notificación
"""
import json
import aio_pika
from typing import Optional
from app.config import settings
from app.utils.logger import logger


class RabbitMQClient:
    """Cliente para publicar mensajes en RabbitMQ"""
    
    def __init__(self):
        self.connection: Optional[aio_pika.Connection] = None
        self.channel: Optional[aio_pika.Channel] = None
        self.queue_name = settings.rabbitmq_queue
    
    async def conectar(self):
        """Conecta a RabbitMQ"""
        try:
            self.connection = await aio_pika.connect_robust(settings.rabbitmq_url)
            self.channel = await self.connection.channel()
            
            # Declarar cola (asegura que existe)
            await self.channel.declare_queue(self.queue_name, durable=True)
            
            logger.info(f"Conectado a RabbitMQ - Cola: {self.queue_name}")
        except Exception as e:
            logger.error(f"Error al conectar a RabbitMQ: {str(e)}")
            raise
    
    async def publicar_mensaje(self, mensaje: dict):
        """
        Publica un mensaje en la cola
        
        Args:
            mensaje: Diccionario con los datos a enviar
        """
        if not self.channel:
            await self.conectar()
        
        try:
            mensaje_json = json.dumps(mensaje)
            
            await self.channel.default_exchange.publish(
                aio_pika.Message(
                    body=mensaje_json.encode(),
                    delivery_mode=aio_pika.DeliveryMode.PERSISTENT  # Mensaje persistente
                ),
                routing_key=self.queue_name
            )
            
            logger.info(f"Mensaje publicado en RabbitMQ: {mensaje_json}")
        except Exception as e:
            logger.error(f"Error al publicar mensaje: {str(e)}")
            raise
    
    async def cerrar(self):
        """Cierra la conexión"""
        if self.connection:
            await self.connection.close()
            logger.info("Conexión a RabbitMQ cerrada")


rabbitmq_client = RabbitMQClient()