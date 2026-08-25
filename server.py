from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class MetadataIn(BaseModel):
    name: str = Field(min_length=1, max_length=64)
    symbol: str = Field(min_length=1, max_length=16)
    description: str = Field(default="", max_length=1000)
    image: str


class TokenRecord(BaseModel):
    mint: str
    owner: str
    cluster: str
    name: str
    symbol: str
    decimals: int = Field(ge=0, le=9)
    initial_supply: str
    metadata_uri: str
    signature: str


@api_router.get("/")
async def root():
    return {"message": "CoinLaunch API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):
    allowed = {"image/png", "image/jpeg", "image/gif", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(415, "Use PNG, JPEG, GIF, or WebP")
    data = await file.read()
    if len(data) > 3 * 1024 * 1024:
        raise HTTPException(413, "Image exceeds 3 MB")
    asset_id = uuid.uuid4().hex[:16]
    await db.assets.insert_one({
        "asset_id": asset_id,
        "content_type": file.content_type,
        "data_b64": base64.b64encode(data).decode(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"id": asset_id}


@api_router.get("/i/{asset_id}")
async def get_image(asset_id: str):
    doc = await db.assets.find_one({"asset_id": asset_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Image not found")
    return Response(
        content=base64.b64decode(doc["data_b64"]),
        media_type=doc["content_type"],
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


@api_router.post("/upload/metadata")
async def upload_metadata(metadata: MetadataIn):
    meta_id = uuid.uuid4().hex[:16]
    await db.metas.insert_one({"meta_id": meta_id, **metadata.model_dump()})
    return {"id": meta_id}


@api_router.get("/m/{meta_id}")
async def get_metadata(meta_id: str):
    doc = await db.metas.find_one({"meta_id": meta_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Metadata not found")
    return {k: doc[k] for k in ("name", "symbol", "description", "image")}


@api_router.post("/tokens")
async def save_token(record: TokenRecord):
    if record.cluster not in {"devnet", "mainnet-beta"}:
        raise HTTPException(400, "Invalid cluster")
    doc = record.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.tokens.insert_one(doc)
    return {"ok": True, "mint": record.mint}


@api_router.get("/tokens/recent")
async def recent_tokens():
    docs = await db.tokens.find({}, {"_id": 0}).sort("created_at", -1).to_list(20)
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
