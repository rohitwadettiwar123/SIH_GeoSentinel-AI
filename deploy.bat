@echo off
echo ========================================================
echo         GeoSentinel AI - Automated Deployment
echo ========================================================

echo 1. Checking for .env file...
if not exist ".env" (
    echo [!] .env not found. Copying .env.example to .env
    copy .env.example .env
    echo Please edit .env with your API keys later!
)

echo.
echo 2. Building and starting Docker containers...
docker-compose up --build -d

echo.
echo 3. Waiting for backend to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

echo.
echo 4. Building the Semantic Search Vector Index...
docker exec -it satquery-backend python scripts/build_geosentinel_index.py

echo.
echo ========================================================
echo Deployment Complete!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo ========================================================
pause
