"""
Lógica de negocio para el servicio de Compras
"""
from decimal import Decimal
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException
from app.database import database, compras_table
from app.models.compra import CompraCreate, CompraPago, CompraResponse, CompraDetallada
from app.services.eventos_client import eventos_client
from app.services.rabbitmq_client import rabbitmq_client 
from app.utils.logger import logger


class ComprasService:
    """Servicio de gestión de compras"""
    
    async def crear_compra(self, compra_data: CompraCreate, usuario_id: str) -> CompraResponse:
        """
        Crea una nueva compra de entradas
        
        Args:
            compra_data: Datos de la compra
            usuario_id: ID del usuario que compra
            
        Returns:
            CompraResponse con los datos de la compra creada
            
        Raises:
            HTTPException 404 si el evento no existe
            HTTPException 400 si hay error en la validación
        """
        # 1. Obtener evento del servicio de Eventos
        evento = await eventos_client.get_evento(compra_data.evento_id)
        
        if not evento:
            raise HTTPException(
                status_code=404,
                detail=f"Evento con ID {compra_data.evento_id} no encontrado"
            )
        
        # 2. Validar disponibilidad (simulado, en producción sería más complejo)
        if compra_data.cantidad > evento.get("capacidad", 0):
            raise HTTPException(
                status_code=400,
                detail=f"No hay suficiente capacidad (disponible: {evento['capacidad']})"
            )
        
        # 3. Calcular total
        precio_unitario = Decimal(str(evento["precio"]))
        total = precio_unitario * Decimal(str(compra_data.cantidad))
        
        # 4. Guardar en base de datos
        query = compras_table.insert().values(
            usuario_id=usuario_id,
            evento_id=compra_data.evento_id,
            cantidad=compra_data.cantidad,
            precio_unitario=precio_unitario,
            total=total,
            estado="pendiente"
        )
        
        compra_id = await database.execute(query)
        
        logger.info(f"Compra {compra_id} creada por usuario {usuario_id}")
        
        # 5. Retornar compra creada
        return await self.get_compra_by_id(compra_id)
    
    async def get_compra_by_id(self, compra_id: int) -> CompraResponse:
        """
        Obtiene una compra por ID
        
        Args:
            compra_id: ID de la compra
            
        Returns:
            CompraResponse
            
        Raises:
            HTTPException 404 si no existe
        """
        query = compras_table.select().where(compras_table.c.id == compra_id)
        compra = await database.fetch_one(query)
        
        if not compra:
            raise HTTPException(
                status_code=404,
                detail=f"Compra con ID {compra_id} no encontrada"
            )
        
        return CompraResponse(**dict(compra))
    
    async def listar_compras_usuario(self, usuario_id: str) -> List[CompraDetallada]:
        """
        Lista todas las compras de un usuario con detalles del evento
        
        Args:
            usuario_id: ID del usuario
            
        Returns:
            Lista de CompraDetallada
        """
        query = compras_table.select().where(
            compras_table.c.usuario_id == usuario_id
        ).order_by(compras_table.c.fecha_compra.desc())
        
        compras = await database.fetch_all(query)
        
        # Enriquecer con datos del evento
        compras_detalladas = []
        for compra in compras:
            compra_dict = dict(compra)
            evento = await eventos_client.get_evento(compra_dict["evento_id"])
            compra_dict["evento"] = evento
            compras_detalladas.append(CompraDetallada(**compra_dict))
        
        return compras_detalladas
    
    async def confirmar_pago(
        self,
        compra_id: int,
        pago_data: CompraPago,
        usuario_id: str
    ) -> CompraResponse:
        """
        Confirma el pago de una compra
        
        Args:
            compra_id: ID de la compra
            pago_data: Datos del pago
            usuario_id: ID del usuario (para validar propiedad)
            
        Returns:
            CompraResponse actualizada
            
        Raises:
            HTTPException 404 si no existe la compra
            HTTPException 403 si no es propietario
            HTTPException 400 si ya está pagada
        """
        # 1. Obtener compra
        compra = await self.get_compra_by_id(compra_id)
        
        # 2. Validar propiedad
        if compra.usuario_id != usuario_id:
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para pagar esta compra"
            )
        
        # 3. Validar estado
        if compra.estado == "pagado":
            raise HTTPException(
                status_code=400,
                detail="Esta compra ya ha sido pagada"
            )
        
        if compra.estado == "cancelado":
            raise HTTPException(
                status_code=400,
                detail="No se puede pagar una compra cancelada"
            )
        
        # 4. Actualizar estado
        fecha_pago = datetime.now()
        query = compras_table.update().where(
            compras_table.c.id == compra_id
        ).values(
            estado="pagado",
            metodo_pago=pago_data.metodo_pago,
            fecha_pago=fecha_pago
        )
        
        await database.execute(query)
        
        logger.info(f"Pago confirmado para compra {compra_id} con {pago_data.metodo_pago}")
        
        #  5. Publicar mensaje en RabbitMQ para notificaciones
        try:
            mensaje = {
                "compraId": compra_id,
                "usuarioId": usuario_id,
                "eventoId": compra.evento_id,
                "cantidad": compra.cantidad,
                "total": float(compra.total),
                "metodoPago": pago_data.metodo_pago,
                "fechaPago": fecha_pago.isoformat()
            }
            await rabbitmq_client.publicar_mensaje(mensaje)
        except Exception as e:
            logger.error(f"Error al publicar mensaje en RabbitMQ: {str(e)}")
            # No fallar la operación si falla la notificación
        
        # 6. Retornar compra actualizada
        return await self.get_compra_by_id(compra_id)
    
    async def cancelar_compra(self, compra_id: int, usuario_id: str) -> CompraResponse:
        """
        Cancela una compra pendiente
        
        Args:
            compra_id: ID de la compra
            usuario_id: ID del usuario
            
        Returns:
            CompraResponse actualizada
            
        Raises:
            HTTPException 403 si no es propietario
            HTTPException 400 si ya está pagada
        """
        compra = await self.get_compra_by_id(compra_id)
        
        if compra.usuario_id != usuario_id:
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para cancelar esta compra"
            )
        
        if compra.estado == "pagado":
            raise HTTPException(
                status_code=400,
                detail="No se puede cancelar una compra ya pagada"
            )
        
        query = compras_table.update().where(
            compras_table.c.id == compra_id
        ).values(estado="cancelado")
        
        await database.execute(query)
        
        logger.info(f"Compra {compra_id} cancelada")
        
        return await self.get_compra_by_id(compra_id)


compras_service = ComprasService()