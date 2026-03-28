from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Universidad(Base):
    __tablename__ = "universidades"

    id_universidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    ubicacion = Column(Text)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    carreras = relationship("Carrera", back_populates="universidad", cascade="all, delete-orphan")


class Carrera(Base):
    __tablename__ = "carreras"

    id_carrera = Column(Integer, primary_key=True, index=True)
    id_universidad = Column(Integer, ForeignKey("universidades.id_universidad", ondelete="CASCADE"))
    nombre = Column(String(200), nullable=False)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    universidad = relationship("Universidad", back_populates="carreras")
    usuario_carreras = relationship("UsuarioCarrera", back_populates="carrera", cascade="all, delete-orphan")


class Rol(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    usuario_roles = relationship("UsuarioRol", back_populates="rol", cascade="all, delete-orphan")


class ConvenioSubsidio(Base):
    __tablename__ = "convenios_subsidios"

    id_subsidio = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    entidad = Column(String(200))
    descripcion = Column(Text)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    usuario_subsidios = relationship("UsuarioSubsidio", back_populates="subsidio", cascade="all, delete-orphan")


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    tipo_documento = Column(String(10), nullable=False)
    numero_documento = Column(String(25), nullable=False)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    usuario_roles = relationship("UsuarioRol", back_populates="usuario", cascade="all, delete-orphan")
    usuario_carreras = relationship("UsuarioCarrera", back_populates="usuario", cascade="all, delete-orphan")
    usuario_subsidios = relationship("UsuarioSubsidio", back_populates="usuario", cascade="all, delete-orphan")
    respuestas = relationship("RespuestaCuestionario", back_populates="usuario", cascade="all, delete-orphan")


class UsuarioRol(Base):
    __tablename__ = "usuario_roles"

    id_usuario_rol = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_rol = Column(Integer, ForeignKey("roles.id_rol", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.current_timestamp())

    usuario = relationship("Usuario", back_populates="usuario_roles")
    rol = relationship("Rol", back_populates="usuario_roles")


class UsuarioCarrera(Base):
    __tablename__ = "usuario_carreras"

    id_usuario_carrera = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_carrera = Column(Integer, ForeignKey("carreras.id_carrera", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.current_timestamp())

    usuario = relationship("Usuario", back_populates="usuario_carreras")
    carrera = relationship("Carrera", back_populates="usuario_carreras")


class UsuarioSubsidio(Base):
    __tablename__ = "usuario_subsidios"

    id_usuario_subsidio = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_subsidio = Column(Integer, ForeignKey("convenios_subsidios.id_subsidio", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.current_timestamp())

    usuario = relationship("Usuario", back_populates="usuario_subsidios")
    subsidio = relationship("ConvenioSubsidio", back_populates="usuario_subsidios")


class Pregunta(Base):
    __tablename__ = "preguntas"

    id_pregunta = Column(Integer, primary_key=True, index=True)
    rasgo = Column(String(1), nullable=False)
    descripcion = Column(Text, nullable=False)
    tipo = Column(String(20), default="opcion_multiple")
    nivel = Column(Integer, default=1)
    activa = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    respuestas = relationship("RespuestaCuestionario", back_populates="pregunta", cascade="all, delete-orphan")


class RespuestaCuestionario(Base):
    __tablename__ = "respuestas_cuestionario"

    id_respuesta = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_pregunta = Column(Integer, ForeignKey("preguntas.id_pregunta", ondelete="CASCADE"))
    valor = Column(Integer)
    created_at = Column(DateTime, server_default=func.current_timestamp())

    __table_args__ = (
        CheckConstraint("valor >= 1 AND valor <= 5", name="respuestas_cuestionario_valor_check"),
    )

    usuario = relationship("Usuario", back_populates="respuestas")
    pregunta = relationship("Pregunta", back_populates="respuestas")
