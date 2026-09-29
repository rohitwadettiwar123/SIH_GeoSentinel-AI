import os
import numpy as np
import rasterio
from rasterio.transform import from_origin
import time
from geosentinel.database.session import SessionLocal, engine
from geosentinel.database.models import Scene, Tile, Base
from geosentinel.ingestion.processor import IngestionProcessor
from geosentinel.embeddings.provider import DummyClipProvider
from geosentinel.vector_store.faiss_store import FaissStore

def create_mock_geotiff(filename: str, width: int = 512, height: int = 512):
    # Creates a 4-band mock GeoTIFF (B, G, R, NIR)
    transform = from_origin(73.8567, 18.5204, 10, 10) # 10m resolution
    data = np.random.randint(0, 255, (4, height, width), dtype=np.uint8)
    
    with rasterio.open(
        filename,
        'w',
        driver='GTiff',
        height=height,
        width=width,
        count=4,
        dtype=data.dtype,
        crs='+proj=latlong',
        transform=transform,
    ) as dst:
        dst.write(data)
    print(f"Created {filename}")

def run_demo():
    print("--- GeoSentinel End-to-End Demo ---")
    os.makedirs("data/mock", exist_ok=True)
    os.makedirs("data/indexes", exist_ok=True)
    
    # 1. Create mock GeoTIFFs
    t0_path = "data/mock/scene_t0.tif"
    t1_path = "data/mock/scene_t1.tif"
    create_mock_geotiff(t0_path)
    create_mock_geotiff(t1_path)
    
    # 2. Ingest scenes
    processor = IngestionProcessor()
    t0_tiles = processor.process_scene(t0_path)
    t1_tiles = processor.process_scene(t1_path)
    all_tiles = t0_tiles + t1_tiles
    print(f"Ingested {len(all_tiles)} tiles.")
    
    # 3. Store in Database
    db = SessionLocal()
    added_scenes = set()
    for t_meta in all_tiles:
        # Create Scene if not exists
        if t_meta.scene_id not in added_scenes:
            scene = db.query(Scene).filter(Scene.scene_id == t_meta.scene_id).first()
            if not scene:
                scene = Scene(
                    scene_id=t_meta.scene_id,
                    sensor=t_meta.sensor,
                    crs=t_meta.crs,
                    resolution_m=t_meta.resolution_m,
                    source_path=t_meta.source_path
                )
                db.add(scene)
            added_scenes.add(t_meta.scene_id)
            
        # Create Tile
        tile = Tile(
            tile_id=t_meta.tile_id,
            scene_id=t_meta.scene_id,
            bbox=str(t_meta.bbox),
            lat=t_meta.lat,
            lon=t_meta.lon,
            quality_score=t_meta.quality_score,
            cloud_frac=t_meta.cloud_pct,
            processing_version=t_meta.processing_version
        )
        db.add(tile)
    db.commit()
    print("Saved metadata to SQLite.")
    
    # 4. Generate Embeddings & add to FAISS
    embedder = DummyClipProvider()
    vectors = embedder.embed_images([t.source_path for t in all_tiles])
    
    store = FaissStore()
    store.add([t.tile_id for t in all_tiles], vectors)
    store.save()
    print("Saved embeddings to FAISS.")
    
    # 5. Search
    print("Performing semantic search...")
    query_vec = embedder.embed_text(["new buildings near river"])
    ids, dists = store.search(query_vec, k=3)
    
    for i, tile_id in enumerate(ids[0]):
        if tile_id:
            print(f"  Hit: {tile_id} (Distance: {dists[0][i]:.2f})")
    
    print("\nDemo pipeline executed successfully!")

if __name__ == "__main__":
    run_demo()
