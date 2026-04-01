from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Type

from database import get_db
import crud
import schemas
import models
from routes import auth

app = FastAPI(
    title="Brujula Joven API",
    version="2.0.0"
)

# ==================== CORS ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTH ====================
app.include_router(auth.router)

# ==================== HEALTH ====================
@app.get("/health")
async def health():
    return {"status": "ok"}


# ==================== GENERADOR DE ENDPOINTS ====================

def register_crud_routes(
    name: str,
    crud_instance,
    response_schema,
    create_schema,
    update_schema
):
    base_path = f"/{name}"

    # GET ALL
    @app.get(base_path, response_model=List[response_schema], tags=[name.capitalize()])
    async def get_all(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
        return await crud_instance.get_all(db, skip, limit)

    # GET BY ID
    @app.get(f"{base_path}/{{id}}", response_model=response_schema, tags=[name.capitalize()])
    async def get_by_id(id: int, db: AsyncSession = Depends(get_db)):
        obj = await crud_instance.get(db, id)
        if not obj:
            raise HTTPException(404, f"{name} not found")
        return obj

    # FILTER
    @app.post(f"{base_path}/filter", tags=[name.capitalize()])
    async def filter_data(payload: dict, db: AsyncSession = Depends(get_db)):
        filters = payload.get("filters", {})
        fields = payload.get("fields", None)
        return await crud_instance.get_filtered(db, filters, fields)

    # CREATE
    @app.post(base_path, response_model=response_schema, status_code=201, tags=[name.capitalize()])
    async def create(item: create_schema, db: AsyncSession = Depends(get_db)):
        return await crud_instance.create(db, item.model_dump())

    # UPDATE
    @app.put(f"{base_path}/{{id}}", response_model=response_schema, tags=[name.capitalize()])
    async def update(id: int, item: update_schema, db: AsyncSession = Depends(get_db)):
        result = await crud_instance.update(db, id, item.model_dump(exclude_unset=True))
        if not result:
            raise HTTPException(404, f"{name} not found")
        return result

    # SOFT DELETE
    @app.put(f"{base_path}/{{id}}/delete", status_code=204, tags=[name.capitalize()])
    async def soft_delete(id: int, db: AsyncSession = Depends(get_db)):
        deleted = await crud_instance.soft_delete(db, id)
        if not deleted:
            raise HTTPException(404, f"{name} not found")
        return None


# ==================== REGISTRO DE ENTIDADES ====================

register_crud_routes(
    "universidades",
    crud.universidad_crud,
    schemas.UniversidadResponse,
    schemas.UniversidadCreate,
    schemas.UniversidadUpdate
)

register_crud_routes(
    "carreras",
    crud.carrera_crud,
    schemas.CarreraResponse,
    schemas.CarreraCreate,
    schemas.CarreraUpdate
)

register_crud_routes(
    "roles",
    crud.rol_crud,
    schemas.RolResponse,
    schemas.RolCreate,
    schemas.RolUpdate
)

register_crud_routes(
    "subsidios",
    crud.subsidio_crud,
    schemas.SubsidioResponse,
    schemas.SubsidioCreate,
    schemas.SubsidioUpdate
)

register_crud_routes(
    "usuarios",
    crud.usuario_crud,
    schemas.UsuarioResponse,
    schemas.UsuarioCreate,
    schemas.UsuarioUpdate
)

register_crud_routes(
    "preguntas",
    crud.pregunta_crud,
    schemas.PreguntaResponse,
    schemas.PreguntaCreate,
    schemas.PreguntaUpdate
)

register_crud_routes(
    "respuestas",
    crud.respuesta_crud,
    schemas.RespuestaResponse,
    schemas.RespuestaCreate,
    schemas.RespuestaUpdate
)


# ==================== ENDPOINTS ESPECIALES ====================

# Carreras por universidad
@app.get("/universidades/{id_universidad}/carreras", tags=["Carreras"])
async def get_carreras_by_universidad(id_universidad: int, db: AsyncSession = Depends(get_db)):
    return await crud.carrera_crud.get_filtered(db, {"id_universidad": id_universidad})


# Roles por usuario
@app.get("/usuarios/{id_usuario}/roles", tags=["Usuario Roles"])
async def get_roles_by_usuario(id_usuario: int, db: AsyncSession = Depends(get_db)):
    return await crud.usuario_rol_crud.get_filtered(db, {"id_usuario": id_usuario})


# Carreras por usuario
@app.get("/usuarios/{id_usuario}/carreras", tags=["Usuario Carreras"])
async def get_carreras_by_usuario(id_usuario: int, db: AsyncSession = Depends(get_db)):
    return await crud.usuario_carrera_crud.get_filtered(db, {"id_usuario": id_usuario})


# Subsidios por usuario
@app.get("/usuarios/{id_usuario}/subsidios", tags=["Usuario Subsidios"])
async def get_subsidios_by_usuario(id_usuario: int, db: AsyncSession = Depends(get_db)):
    return await crud.usuario_subsidio_crud.get_filtered(db, {"id_usuario": id_usuario})


# ==================== PREGUNTAS ESPECIALES ====================

@app.get("/preguntas/nivel/{nivel}", tags=["Preguntas"])
async def get_preguntas_by_nivel(nivel: int, db: AsyncSession = Depends(get_db)):
    return await crud.pregunta_crud.get_filtered(db, {"nivel": nivel})


@app.get("/preguntas/multiples", tags=["Preguntas"])
async def get_preguntas_multiples(db: AsyncSession = Depends(get_db)):
    preguntas = await crud.pregunta_crud.get_all(db)
    relaciones = await crud.pregunta_crud.get_multiples(db)

    preguntas_dict = {p.id_pregunta: p for p in preguntas}
    resultado = {}

    for rel in relaciones:
        enunciado = preguntas_dict.get(rel.id_enunciado)
        opcion = preguntas_dict.get(rel.id_pregunta)

        if not enunciado or not opcion:
            continue

        if rel.id_enunciado not in resultado:
            resultado[rel.id_enunciado] = {
                "id": enunciado.id_pregunta,
                "enunciado": enunciado.descripcion,
                "opciones": []
            }

        resultado[rel.id_enunciado]["opciones"].append({
            "id": opcion.id_pregunta,
            "texto": opcion.descripcion,
            "rasgo": opcion.rasgo
        })

    return list(resultado.values())