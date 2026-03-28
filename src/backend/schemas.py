from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


# Universidad Schemas
class UniversidadBase(BaseModel):
    nombre: str = Field(..., max_length=200)
    ubicacion: Optional[str] = None
    estado: bool = True


class UniversidadCreate(UniversidadBase):
    pass


class UniversidadUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=200)
    ubicacion: Optional[str] = None
    estado: Optional[bool] = None


class UniversidadResponse(UniversidadBase):
    id_universidad: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Carrera Schemas
class CarreraBase(BaseModel):
    nombre: str = Field(..., max_length=200)
    id_universidad: Optional[int] = None
    estado: bool = True


class CarreraCreate(CarreraBase):
    pass


class CarreraUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=200)
    id_universidad: Optional[int] = None
    estado: Optional[bool] = None


class CarreraResponse(CarreraBase):
    id_carrera: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Rol Schemas
class RolBase(BaseModel):
    nombre: str = Field(..., max_length=50)
    estado: bool = True


class RolCreate(RolBase):
    pass


class RolUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=50)
    estado: Optional[bool] = None


class RolResponse(RolBase):
    id_rol: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ConvenioSubsidio Schemas
class SubsidioBase(BaseModel):
    nombre: str = Field(..., max_length=200)
    entidad: Optional[str] = Field(None, max_length=200)
    descripcion: Optional[str] = None
    estado: bool = True


class SubsidioCreate(SubsidioBase):
    pass


class SubsidioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=200)
    entidad: Optional[str] = Field(None, max_length=200)
    descripcion: Optional[str] = None
    estado: Optional[bool] = None


class SubsidioResponse(SubsidioBase):
    id_subsidio: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Usuario Schemas
class UsuarioBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    email: EmailStr
    tipo_documento: str = Field(..., max_length=10)
    numero_documento: str = Field(..., max_length=25)
    estado: bool = True


class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    tipo_documento: Optional[str] = Field(None, max_length=10)
    numero_documento: Optional[str] = Field(None, max_length=25)
    estado: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=6)


class UsuarioResponse(UsuarioBase):
    id_usuario: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# UsuarioRol Schemas
class UsuarioRolBase(BaseModel):
    id_usuario: int
    id_rol: int


class UsuarioRolCreate(UsuarioRolBase):
    pass


class UsuarioRolResponse(UsuarioRolBase):
    id_usuario_rol: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# UsuarioCarrera Schemas
class UsuarioCarreraBase(BaseModel):
    id_usuario: int
    id_carrera: int


class UsuarioCarreraCreate(UsuarioCarreraBase):
    pass


class UsuarioCarreraResponse(UsuarioCarreraBase):
    id_usuario_carrera: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# UsuarioSubsidio Schemas
class UsuarioSubsidioBase(BaseModel):
    id_usuario: int
    id_subsidio: int


class UsuarioSubsidioCreate(UsuarioSubsidioBase):
    pass


class UsuarioSubsidioResponse(UsuarioSubsidioBase):
    id_usuario_subsidio: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Pregunta Schemas
class PreguntaBase(BaseModel):
    rasgo: str = Field(..., max_length=1)
    descripcion: str
    tipo: str = Field(default="opcion_multiple", max_length=20)
    nivel: int = Field(default=1, ge=1)
    activa: bool = True

class PreguntaSimple(BaseModel):
    id_pregunta: int
    rasgo: str
    descripcion: str
    nivel: int 

    class Config:
        from_attributes = True


class PreguntaCreate(PreguntaBase):
    pass


class PreguntaUpdate(BaseModel):
    rasgo: Optional[str] = Field(None, max_length=1)
    descripcion: Optional[str] = None
    tipo: Optional[str] = Field(None, max_length=20)
    nivel: Optional[int] = Field(None, ge=1)
    activa: Optional[bool] = None


class PreguntaResponse(PreguntaBase):
    id_pregunta: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# RespuestaCuestionario Schemas
class RespuestaBase(BaseModel):
    id_usuario: int
    id_pregunta: int
    valor: int = Field(..., ge=1, le=5)


class RespuestaCreate(RespuestaBase):
    pass


class RespuestaResponse(RespuestaBase):
    id_respuesta: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
