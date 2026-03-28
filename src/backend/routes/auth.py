from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import schemas
import crud
from database import get_db
from auth_config import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=schemas.UsuarioResponse)
async def register(
    user: schemas.UsuarioCreate,
    db: AsyncSession = Depends(get_db)
):
    new_user = await crud.usuario_crud.create(db, user)

    if not new_user:
        raise HTTPException(status_code=400, detail="El correo ya existe")

    return new_user


@router.post("/login", response_model=schemas.TokenResponse)
async def login(
    credentials: schemas.LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await crud.usuario_crud.authenticate(
        db,
        credentials.email,
        credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    token = create_access_token({
        "sub": str(user.id_usuario),
        "email": user.email,
        "nombre": user.nombre
    })

    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": user.id_usuario,
        "nombre": user.nombre,
        "email": user.email
    }
}