import os
import sys
from pathlib import Path
import random

# Add root to pythonpath
sys.path.append(str(Path(__file__).resolve().parent.parent))

from geosentinel.core.registry import get_plugin
import geosentinel.embeddings.provider
import geosentinel.vector_store.faiss_store

def main():
    print("Building GeoSentinel Semantic Index...")
    
    EmbeddingCls = get_plugin("embedding", "gemini_api")
    embedder = EmbeddingCls()
    
    VectorStoreCls = get_plugin("vector_store", "faiss")
    store = VectorStoreCls(dim=embedder.dim)
    
    uploads_dir = Path(__file__).resolve().parent.parent / "backend" / "data" / "uploads"
    images = list(uploads_dir.glob("*.jpg")) + list(uploads_dir.glob("*.png"))
    
    if not images:
        print("No images found to index.")
        return
        
    print(f"Found {len(images)} images.")
    
    for i, img_path in enumerate(images):
        print(f"[{i+1}/{len(images)}] Indexing {img_path.name}...")
        
        vec = embedder.embed_images([str(img_path)])
        
        # Extract hints from file name
        cloud = 0.0
        sensor = "Sentinel-2"
        if "sar" in img_path.name.lower():
            sensor = "Sentinel-1 SAR"
        elif "optical" in img_path.name.lower():
            sensor = "Sentinel-2"
        
        meta = {
            "tile_id": f"TILE_{img_path.stem}",
            "scene_id": f"SCENE_{i:04d}",
            "image_url": f"/uploads/{img_path.name}",
            "preview_url": f"/uploads/{img_path.name}",
            "latitude": round(random.uniform(10.0, 30.0), 3),
            "longitude": round(random.uniform(70.0, 90.0), 3),
            "acquisition_date": "2024-08-15",
            "sensor": sensor,
            "cloud_cover": round(random.uniform(0, 5), 1)
        }
        
        store.add([meta["tile_id"]], vec, [meta])
        
    print("Saving index...")
    store.save()
    print("Index built successfully!")

if __name__ == "__main__":
    main()
