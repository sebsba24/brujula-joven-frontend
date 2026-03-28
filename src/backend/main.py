import fastapi
import fastapi.middleware.cors
from typing import List

from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import schemas
import crud

app = fastapi.FastAPI(
    title="University Management API",
    description="REST API for managing universities, careers, users, roles, subsidies, and questionnaires",
    version="1.0.0",
)

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health Check
@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


# ==================== UNIVERSIDADES ====================
@app.get("/universidades", response_model=List[schemas.UniversidadResponse], tags=["Universidades"])
async def get_universidades(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.universidad_crud.get_all(db, skip=skip, limit=limit)


@app.get("/universidades/{id}", response_model=schemas.UniversidadResponse, tags=["Universidades"])
async def get_universidad(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    universidad = await crud.universidad_crud.get(db, id)
    if not universidad:
        raise fastapi.HTTPException(status_code=404, detail="Universidad not found")
    return universidad


@app.post("/universidades", response_model=schemas.UniversidadResponse, status_code=201, tags=["Universidades"])
async def create_universidad(universidad: schemas.UniversidadCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.universidad_crud.create(db, universidad.model_dump())


@app.put("/universidades/{id}", response_model=schemas.UniversidadResponse, tags=["Universidades"])
async def update_universidad(id: int, universidad: schemas.UniversidadUpdate, db: AsyncSession = fastapi.Depends(get_db)):
    result = await crud.universidad_crud.update(db, id, universidad)
    if not result:
        raise fastapi.HTTPException(status_code=404, detail="Universidad not found")
    return result


@app.delete("/universidades/{id}", status_code=204, tags=["Universidades"])
async def delete_universidad(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.universidad_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Universidad not found")
    return None


# ==================== CARRERAS ====================
@app.get("/carreras", response_model=List[schemas.CarreraResponse], tags=["Carreras"])
async def get_carreras(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.carrera_crud.get_all(db, skip=skip, limit=limit)


@app.get("/carreras/{id}", response_model=schemas.CarreraResponse, tags=["Carreras"])
async def get_carrera(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    carrera = await crud.carrera_crud.get(db, id)
    if not carrera:
        raise fastapi.HTTPException(status_code=404, detail="Carrera not found")
    return carrera


@app.get("/universidades/{id_universidad}/carreras", response_model=List[schemas.CarreraResponse], tags=["Carreras"])
async def get_carreras_by_universidad(id_universidad: int, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.carrera_crud.get_by_universidad(db, id_universidad)


@app.post("/carreras", response_model=schemas.CarreraResponse, status_code=201, tags=["Carreras"])
async def create_carrera(carrera: schemas.CarreraCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.carrera_crud.create(db, carrera.model_dump())


@app.put("/carreras/{id}", response_model=schemas.CarreraResponse, tags=["Carreras"])
async def update_carrera(id: int, carrera: schemas.CarreraUpdate, db: AsyncSession = fastapi.Depends(get_db)):
    result = await crud.carrera_crud.update(db, id, carrera)
    if not result:
        raise fastapi.HTTPException(status_code=404, detail="Carrera not found")
    return result


@app.delete("/carreras/{id}", status_code=204, tags=["Carreras"])
async def delete_carrera(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.carrera_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Carrera not found")
    return None


# ==================== ROLES ====================
@app.get("/roles", response_model=List[schemas.RolResponse], tags=["Roles"])
async def get_roles(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.rol_crud.get_all(db, skip=skip, limit=limit)


@app.get("/roles/{id}", response_model=schemas.RolResponse, tags=["Roles"])
async def get_rol(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    rol = await crud.rol_crud.get(db, id)
    if not rol:
        raise fastapi.HTTPException(status_code=404, detail="Rol not found")
    return rol


@app.post("/roles", response_model=schemas.RolResponse, status_code=201, tags=["Roles"])
async def create_rol(rol: schemas.RolCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.rol_crud.create(db, rol.model_dump())


@app.put("/roles/{id}", response_model=schemas.RolResponse, tags=["Roles"])
async def update_rol(id: int, rol: schemas.RolUpdate, db: AsyncSession = fastapi.Depends(get_db)):
    result = await crud.rol_crud.update(db, id, rol)
    if not result:
        raise fastapi.HTTPException(status_code=404, detail="Rol not found")
    return result


@app.delete("/roles/{id}", status_code=204, tags=["Roles"])
async def delete_rol(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.rol_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Rol not found")
    return None


# ==================== CONVENIOS/SUBSIDIOS ====================
@app.get("/subsidios", response_model=List[schemas.SubsidioResponse], tags=["Subsidios"])
async def get_subsidios(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.subsidio_crud.get_all(db, skip=skip, limit=limit)


@app.get("/subsidios/{id}", response_model=schemas.SubsidioResponse, tags=["Subsidios"])
async def get_subsidio(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    subsidio = await crud.subsidio_crud.get(db, id)
    if not subsidio:
        raise fastapi.HTTPException(status_code=404, detail="Subsidio not found")
    return subsidio


@app.post("/subsidios", response_model=schemas.SubsidioResponse, status_code=201, tags=["Subsidios"])
async def create_subsidio(subsidio: schemas.SubsidioCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.subsidio_crud.create(db, subsidio.model_dump())


@app.put("/subsidios/{id}", response_model=schemas.SubsidioResponse, tags=["Subsidios"])
async def update_subsidio(id: int, subsidio: schemas.SubsidioUpdate, db: AsyncSession = fastapi.Depends(get_db)):
    result = await crud.subsidio_crud.update(db, id, subsidio)
    if not result:
        raise fastapi.HTTPException(status_code=404, detail="Subsidio not found")
    return result


@app.delete("/subsidios/{id}", status_code=204, tags=["Subsidios"])
async def delete_subsidio(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.subsidio_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Subsidio not found")
    return None


# ==================== USUARIOS ====================
@app.get("/usuarios", response_model=List[schemas.UsuarioResponse], tags=["Usuarios"])
async def get_usuarios(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_crud.get_all(db, skip=skip, limit=limit)


@app.get("/usuarios/{id}", response_model=schemas.UsuarioResponse, tags=["Usuarios"])
async def get_usuario(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    usuario = await crud.usuario_crud.get(db, id)
    if not usuario:
        raise fastapi.HTTPException(status_code=404, detail="Usuario not found")
    return usuario


@app.post("/usuarios", response_model=schemas.UsuarioResponse, status_code=201, tags=["Usuarios"])
async def create_usuario(usuario: schemas.UsuarioCreate, db: AsyncSession = fastapi.Depends(get_db)):
    existing = await crud.usuario_crud.get_by_email(db, usuario.email)
    if existing:
        raise fastapi.HTTPException(status_code=400, detail="Email already registered")
    return await crud.usuario_crud.create(db, usuario)


@app.put("/usuarios/{id}", response_model=schemas.UsuarioResponse, tags=["Usuarios"])
async def update_usuario(id: int, usuario: schemas.UsuarioUpdate, db: AsyncSession = fastapi.Depends(get_db)):
    result = await crud.usuario_crud.update(db, id, usuario)
    if not result:
        raise fastapi.HTTPException(status_code=404, detail="Usuario not found")
    return result


@app.delete("/usuarios/{id}", status_code=204, tags=["Usuarios"])
async def delete_usuario(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.usuario_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Usuario not found")
    return None


# ==================== USUARIO ROLES ====================
@app.get("/usuario-roles", response_model=List[schemas.UsuarioRolResponse], tags=["Usuario Roles"])
async def get_usuario_roles(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_rol_crud.get_all(db, skip=skip, limit=limit)


@app.get("/usuarios/{id_usuario}/roles", response_model=List[schemas.UsuarioRolResponse], tags=["Usuario Roles"])
async def get_roles_by_usuario(id_usuario: int, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_rol_crud.get_by_usuario(db, id_usuario)


@app.post("/usuario-roles", response_model=schemas.UsuarioRolResponse, status_code=201, tags=["Usuario Roles"])
async def create_usuario_rol(usuario_rol: schemas.UsuarioRolCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_rol_crud.create(db, usuario_rol.model_dump())


@app.delete("/usuario-roles/{id}", status_code=204, tags=["Usuario Roles"])
async def delete_usuario_rol(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.usuario_rol_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Usuario-Rol not found")
    return None


# ==================== USUARIO CARRERAS ====================
@app.get("/usuario-carreras", response_model=List[schemas.UsuarioCarreraResponse], tags=["Usuario Carreras"])
async def get_usuario_carreras(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_carrera_crud.get_all(db, skip=skip, limit=limit)


@app.get("/usuarios/{id_usuario}/carreras", response_model=List[schemas.UsuarioCarreraResponse], tags=["Usuario Carreras"])
async def get_carreras_by_usuario(id_usuario: int, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_carrera_crud.get_by_usuario(db, id_usuario)


@app.post("/usuario-carreras", response_model=schemas.UsuarioCarreraResponse, status_code=201, tags=["Usuario Carreras"])
async def create_usuario_carrera(usuario_carrera: schemas.UsuarioCarreraCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_carrera_crud.create(db, usuario_carrera.model_dump())


@app.delete("/usuario-carreras/{id}", status_code=204, tags=["Usuario Carreras"])
async def delete_usuario_carrera(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.usuario_carrera_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Usuario-Carrera not found")
    return None


# ==================== USUARIO SUBSIDIOS ====================
@app.get("/usuario-subsidios", response_model=List[schemas.UsuarioSubsidioResponse], tags=["Usuario Subsidios"])
async def get_usuario_subsidios(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_subsidio_crud.get_all(db, skip=skip, limit=limit)


@app.get("/usuarios/{id_usuario}/subsidios", response_model=List[schemas.UsuarioSubsidioResponse], tags=["Usuario Subsidios"])
async def get_subsidios_by_usuario(id_usuario: int, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_subsidio_crud.get_by_usuario(db, id_usuario)


@app.post("/usuario-subsidios", response_model=schemas.UsuarioSubsidioResponse, status_code=201, tags=["Usuario Subsidios"])
async def create_usuario_subsidio(usuario_subsidio: schemas.UsuarioSubsidioCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.usuario_subsidio_crud.create(db, usuario_subsidio.model_dump())


@app.delete("/usuario-subsidios/{id}", status_code=204, tags=["Usuario Subsidios"])
async def delete_usuario_subsidio(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.usuario_subsidio_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Usuario-Subsidio not found")
    return None


# ==================== PREGUNTAS ====================
@app.get("/preguntas", response_model=List[schemas.PreguntaResponse], tags=["Preguntas"])
async def get_preguntas(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.pregunta_crud.get_all(db, skip=skip, limit=limit)

@app.get("/preguntas/simple", response_model=List[schemas.PreguntaSimple])
async def get_preguntas_simple(
    nivel: int = None,
    db: AsyncSession = fastapi.Depends(get_db)
):
    if nivel is not None:
        return await crud.pregunta_crud.get_by_nivel(db, nivel)

    return await crud.pregunta_crud.get_active(db)


@app.get("/preguntas/activas", response_model=List[schemas.PreguntaResponse], tags=["Preguntas"])
async def get_preguntas_activas(db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.pregunta_crud.get_active(db)


@app.get("/preguntas/{id}", response_model=schemas.PreguntaResponse, tags=["Preguntas"])
async def get_pregunta(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    pregunta = await crud.pregunta_crud.get(db, id)
    if not pregunta:
        raise fastapi.HTTPException(status_code=404, detail="Pregunta not found")
    return pregunta


@app.post("/preguntas", response_model=schemas.PreguntaResponse, status_code=201, tags=["Preguntas"])
async def create_pregunta(pregunta: schemas.PreguntaCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.pregunta_crud.create(db, pregunta.model_dump())


@app.put("/preguntas/{id}", response_model=schemas.PreguntaResponse, tags=["Preguntas"])
async def update_pregunta(id: int, pregunta: schemas.PreguntaUpdate, db: AsyncSession = fastapi.Depends(get_db)):
    result = await crud.pregunta_crud.update(db, id, pregunta)
    if not result:
        raise fastapi.HTTPException(status_code=404, detail="Pregunta not found")
    return result


@app.delete("/preguntas/{id}", status_code=204, tags=["Preguntas"])
async def delete_pregunta(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.pregunta_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Pregunta not found")
    return None


# ==================== RESPUESTAS CUESTIONARIO ====================
@app.get("/respuestas", response_model=List[schemas.RespuestaResponse], tags=["Respuestas"])
async def get_respuestas(skip: int = 0, limit: int = 100, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.respuesta_crud.get_all(db, skip=skip, limit=limit)


@app.get("/usuarios/{id_usuario}/respuestas", response_model=List[schemas.RespuestaResponse], tags=["Respuestas"])
async def get_respuestas_by_usuario(id_usuario: int, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.respuesta_crud.get_by_usuario(db, id_usuario)


@app.get("/respuestas/{id}", response_model=schemas.RespuestaResponse, tags=["Respuestas"])
async def get_respuesta(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    respuesta = await crud.respuesta_crud.get(db, id)
    if not respuesta:
        raise fastapi.HTTPException(status_code=404, detail="Respuesta not found")
    return respuesta


@app.post("/respuestas", response_model=schemas.RespuestaResponse, status_code=201, tags=["Respuestas"])
async def create_respuesta(respuesta: schemas.RespuestaCreate, db: AsyncSession = fastapi.Depends(get_db)):
    return await crud.respuesta_crud.create(db, respuesta.model_dump())


@app.delete("/respuestas/{id}", status_code=204, tags=["Respuestas"])
async def delete_respuesta(id: int, db: AsyncSession = fastapi.Depends(get_db)):
    deleted = await crud.respuesta_crud.delete(db, id)
    if not deleted:
        raise fastapi.HTTPException(status_code=404, detail="Respuesta not found")
    return None
