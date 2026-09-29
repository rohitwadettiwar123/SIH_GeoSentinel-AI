from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from geosentinel.database.session import Base
from datetime import datetime

class Scene(Base):
    __tablename__ = "scenes"
    scene_id = Column(String, primary_key=True, index=True)
    sensor = Column(String)
    acquisition_time = Column(DateTime, default=datetime.utcnow)
    cloud_pct = Column(Float)
    crs = Column(String)
    resolution_m = Column(Float)
    source_path = Column(String)
    sha256 = Column(String)
    
    tiles = relationship("Tile", back_populates="scene")

class Tile(Base):
    __tablename__ = "tiles"
    tile_id = Column(String, primary_key=True, index=True)
    scene_id = Column(String, ForeignKey("scenes.scene_id"))
    bbox = Column(String) # Stored as JSON string
    lat = Column(Float)
    lon = Column(Float)
    quality_score = Column(Float)
    cloud_frac = Column(Float)
    processing_version = Column(String)

    scene = relationship("Scene", back_populates="tiles")
    embeddings = relationship("Embedding", back_populates="tile")

class Embedding(Base):
    __tablename__ = "embeddings"
    embedding_id = Column(String, primary_key=True, index=True)
    tile_id = Column(String, ForeignKey("tiles.tile_id"))
    model_name = Column(String)
    model_version = Column(String)
    dim = Column(Integer)
    vector_row = Column(Integer) # ID in FAISS
    
    tile = relationship("Tile", back_populates="embeddings")

class ChangeEvent(Base):
    __tablename__ = "change_events"
    event_id = Column(String, primary_key=True, index=True)
    tile_id = Column(String, ForeignKey("tiles.tile_id"))
    change_type = Column(String)
    confidence = Column(Float)
    status = Column(String)
