@echo off
echo ========================================================
echo Starting GeoSentinel AI Offline Pipeline
echo ========================================================

echo 1. Initializing Database...
set PYTHONPATH=.
python scripts/init_db.py

echo 2. Running Demo Pipeline (creating sample data & indexing)...
python scripts/demo_pipeline.py

echo 3. Starting FastAPI Backend...
start "GeoSentinel API" cmd /c "uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo 4. Starting React Frontend...
cd frontend
start "GeoSentinel UI" cmd /c "npm install && npm run dev"
cd ..

echo ========================================================
echo System is starting up. 
echo API: http://localhost:8000/docs
echo UI: http://localhost:5173
echo ========================================================
