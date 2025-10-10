"""
Validación de JWT compatible con servicio de Usuarios (Node.js)
"""
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.config import settings

security = HTTPBearer()


def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Valida el token JWT y retorna los claims
    
    Args:
        credentials: Token Bearer del header Authorization
        
    Returns:
        dict con claims (id, role, exp)
        
    Raises:
        HTTPException 401 si el token es inválido
    """
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        
        # Validar campos requeridos
        if "id" not in payload or "role" not in payload:
            raise HTTPException(
                status_code=401,
                detail="Token inválido: faltan claims requeridos"
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirado"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token inválido: {str(e)}"
        )


def get_current_user(token_data: dict = Security(verify_jwt)) -> dict:
    """Obtiene el usuario actual del token"""
    return {
        "id": token_data["id"],
        "role": token_data["role"]
    }