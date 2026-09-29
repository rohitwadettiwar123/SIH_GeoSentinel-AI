import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from geosentinel.core.config import config

db_path = config.get("storage.path", "data/geo.db")
os.makedirs(os.path.dirname(db_path), exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

# Check for WAL mode compatibility in SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        # Enable WAL mode for performance
        db.execute("PRAGMA journal_mode=WAL;")
        yield db
    finally:
        db.close()
