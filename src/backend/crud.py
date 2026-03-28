from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from typing import TypeVar, Generic, Type, Optional, List
from fastapi import HTTPException
from security import verify_password
from security import hash_password


from database import Base
import models
import schemas


T = TypeVar("T", bound=Base)


class CRUDBase(Generic[T]):
    def __init__(self, model: Type[T]):
        self.model = model

    async def get(self, db: AsyncSession, id: int, id_field: str) -> Optional[T]:
        result = await db.execute(
            select(self.model).where(getattr(self.model, id_field) == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[T]:
        result = await db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, obj_in: dict) -> T:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        try:
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except IntegrityError as e:
            await db.rollback()
            raise HTTPException(status_code=400, detail=f"Integrity error: {str(e)}")

    async def update(self, db: AsyncSession, id: int, id_field: str, obj_in: dict) -> Optional[T]:
        db_obj = await self.get(db, id, id_field)
        if not db_obj:
            return None
        for key, value in obj_in.items():
            if value is not None:
                setattr(db_obj, key, value)
        try:
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except IntegrityError as e:
            await db.rollback()
            raise HTTPException(status_code=400, detail=f"Integrity error: {str(e)}")

    async def delete(self, db: AsyncSession, id: int, id_field: str) -> bool:
        db_obj = await self.get(db, id, id_field)
        if not db_obj:
            return False
        await db.delete(db_obj)
        await db.commit()
        return True


# Universidad CRUD
class CRUDUniversidad(CRUDBase[models.Universidad]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.Universidad]:
        return await super().get(db, id, "id_universidad")

    async def update(self, db: AsyncSession, id: int, obj_in: schemas.UniversidadUpdate) -> Optional[models.Universidad]:
        return await super().update(db, id, "id_universidad", obj_in.model_dump(exclude_unset=True))

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_universidad")


# Carrera CRUD
class CRUDCarrera(CRUDBase[models.Carrera]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.Carrera]:
        return await super().get(db, id, "id_carrera")

    async def get_by_universidad(self, db: AsyncSession, id_universidad: int) -> List[models.Carrera]:
        result = await db.execute(
            select(models.Carrera).where(models.Carrera.id_universidad == id_universidad)
        )
        return list(result.scalars().all())

    async def update(self, db: AsyncSession, id: int, obj_in: schemas.CarreraUpdate) -> Optional[models.Carrera]:
        return await super().update(db, id, "id_carrera", obj_in.model_dump(exclude_unset=True))

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_carrera")


# Rol CRUD
class CRUDRol(CRUDBase[models.Rol]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.Rol]:
        return await super().get(db, id, "id_rol")

    async def update(self, db: AsyncSession, id: int, obj_in: schemas.RolUpdate) -> Optional[models.Rol]:
        return await super().update(db, id, "id_rol", obj_in.model_dump(exclude_unset=True))

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_rol")


# Subsidio CRUD
class CRUDSubsidio(CRUDBase[models.ConvenioSubsidio]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.ConvenioSubsidio]:
        return await super().get(db, id, "id_subsidio")

    async def update(self, db: AsyncSession, id: int, obj_in: schemas.SubsidioUpdate) -> Optional[models.ConvenioSubsidio]:
        return await super().update(db, id, "id_subsidio", obj_in.model_dump(exclude_unset=True))

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_subsidio")


# Usuario CRUD
class CRUDUsuario(CRUDBase[models.Usuario]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.Usuario]:
        return await super().get(db, id, "id_usuario")

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[models.Usuario]:
        result = await db.execute(
            select(models.Usuario).where(models.Usuario.email == email)
        )
        return result.scalar_one_or_none()
    
    async def authenticate(self, db, email: str, password: str):
        user = await self.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(password, user.password_hash):
            return None

        return user

    async def create(self, db: AsyncSession, obj_in: schemas.UsuarioCreate) -> models.Usuario:
        user_data = obj_in.model_dump(exclude={"password"})
        user_data["password_hash"] = hash_password(obj_in.password)
        return await super().create(db, user_data)

    async def update(self, db: AsyncSession, id: int, obj_in: schemas.UsuarioUpdate) -> Optional[models.Usuario]:
        update_data = obj_in.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["password_hash"] = hash_password(update_data["password"])
            del update_data["password"]
        return await super().update(db, id, "id_usuario", update_data)

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_usuario")


# UsuarioRol CRUD
class CRUDUsuarioRol(CRUDBase[models.UsuarioRol]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.UsuarioRol]:
        return await super().get(db, id, "id_usuario_rol")

    async def get_by_usuario(self, db: AsyncSession, id_usuario: int) -> List[models.UsuarioRol]:
        result = await db.execute(
            select(models.UsuarioRol).where(models.UsuarioRol.id_usuario == id_usuario)
        )
        return list(result.scalars().all())

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_usuario_rol")


# UsuarioCarrera CRUD
class CRUDUsuarioCarrera(CRUDBase[models.UsuarioCarrera]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.UsuarioCarrera]:
        return await super().get(db, id, "id_usuario_carrera")

    async def get_by_usuario(self, db: AsyncSession, id_usuario: int) -> List[models.UsuarioCarrera]:
        result = await db.execute(
            select(models.UsuarioCarrera).where(models.UsuarioCarrera.id_usuario == id_usuario)
        )
        return list(result.scalars().all())

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_usuario_carrera")


# UsuarioSubsidio CRUD
class CRUDUsuarioSubsidio(CRUDBase[models.UsuarioSubsidio]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.UsuarioSubsidio]:
        return await super().get(db, id, "id_usuario_subsidio")

    async def get_by_usuario(self, db: AsyncSession, id_usuario: int) -> List[models.UsuarioSubsidio]:
        result = await db.execute(
            select(models.UsuarioSubsidio).where(models.UsuarioSubsidio.id_usuario == id_usuario)
        )
        return list(result.scalars().all())

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_usuario_subsidio")


# Pregunta CRUD
class CRUDPregunta(CRUDBase[models.Pregunta]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.Pregunta]:
        return await super().get(db, id, "id_pregunta")

    async def get_active(self, db: AsyncSession) -> List[models.Pregunta]:
        result = await db.execute(
            select(models.Pregunta).where(models.Pregunta.activa == True)
        )
        return list(result.scalars().all())

    async def get_by_nivel(self, db: AsyncSession, nivel: int) -> List[models.Pregunta]:
        result = await db.execute(
            select(models.Pregunta).where(
                models.Pregunta.nivel == nivel,
                models.Pregunta.activa == True  # opcional pero recomendado
            )
        )
        return list(result.scalars().all())

    async def update(self, db: AsyncSession, id: int, obj_in: schemas.PreguntaUpdate) -> Optional[models.Pregunta]:
        return await super().update(db, id, "id_pregunta", obj_in.model_dump(exclude_unset=True))

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_pregunta")


# Respuesta CRUD
class CRUDRespuesta(CRUDBase[models.RespuestaCuestionario]):
    async def get(self, db: AsyncSession, id: int) -> Optional[models.RespuestaCuestionario]:
        return await super().get(db, id, "id_respuesta")

    async def get_by_usuario(self, db: AsyncSession, id_usuario: int) -> List[models.RespuestaCuestionario]:
        result = await db.execute(
            select(models.RespuestaCuestionario).where(models.RespuestaCuestionario.id_usuario == id_usuario)
        )
        return list(result.scalars().all())

    async def delete(self, db: AsyncSession, id: int) -> bool:
        return await super().delete(db, id, "id_respuesta")


# Instantiate CRUD objects
universidad_crud = CRUDUniversidad(models.Universidad)
carrera_crud = CRUDCarrera(models.Carrera)
rol_crud = CRUDRol(models.Rol)
subsidio_crud = CRUDSubsidio(models.ConvenioSubsidio)
usuario_crud = CRUDUsuario(models.Usuario)
usuario_rol_crud = CRUDUsuarioRol(models.UsuarioRol)
usuario_carrera_crud = CRUDUsuarioCarrera(models.UsuarioCarrera)
usuario_subsidio_crud = CRUDUsuarioSubsidio(models.UsuarioSubsidio)
pregunta_crud = CRUDPregunta(models.Pregunta)
respuesta_crud = CRUDRespuesta(models.RespuestaCuestionario)
