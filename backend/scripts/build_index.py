import os
import sys
from pathlib import Path
import random

# Add backend to path so we can import ai
sys.path.append(str(Path(__file__).resolve().parent.parent))

from ai.semantic_engine import engine

def main():
    print("Initializing Semantic Engine...")
    engine.load()
    
    uploads_dir = Path(__file__).resolve().parent.parent / "data" / "uploads"
    if not uploads_dir.exists():
        print(f"No uploads directory found at {uploads_dir}")
        return
        
    print(f"Scanning images in {uploads_dir}...")
    images = list(uploads_dir.glob("*.jpg")) + list(uploads_dir.glob("*.png"))
    
    if not images:
        print("No images found.")
        return
        
    print(f"Found {len(images)} images to index.")
    
    # We will just clear existing index and rebuild
    engine.index.reset()
    engine.metadata = []
    
    for i, img_path in enumerate(images):
        print(f"[{i+1}/{len(images)}] Embedding {img_path.name}...")
        
        # Mocking some metadata since we only have demo files
        # We can extract some hints from the filename (e.g. 'flood', 'construction')
        
        meta = {
            "tile_id": f"TILE_{img_path.stem}",
            "scene_id": f"SCENE_{i:04d}",
            "image_url": f"/uploads/{img_path.name}",
            "preview_url": f"/uploads/{img_path.name}",
            "latitude": round(random.uniform(10.0, 30.0), 3),
            "longitude": round(random.uniform(70.0, 90.0), 3),
            "acquisition_date": "2024-08-15",
            "sensor": "Sentinel-2",
            "cloud_cover": round(random.uniform(0, 15), 1)
        }
        
        engine.add_image(str(img_path), meta)
        
    print("Saving index...")
    engine.save()
    print("Index built successfully!")

if __name__ == "__main__":
    main()
