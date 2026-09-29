#!/bin/bash
set -e

echo "========================================================"
echo "        GeoSentinel AI - Automated Deployment"
echo "========================================================"

echo "1. Checking for .env file..."
if [ ! -f .env ]; then
    echo "[!] .env not found. Copying .env.example to .env"
    cp .env.example .env
    echo "Please edit .env with your API keys later!"
fi

echo ""
echo "2. Building and starting Docker containers..."
docker-compose up --build -d

echo ""
echo "3. Waiting for backend to initialize (15 seconds)..."
sleep 15

echo ""
echo "4. Building the Semantic Search Vector Index..."
docker exec -it satquery-backend python scripts/build_geosentinel_index.py

echo ""
echo "========================================================"
echo "Deployment Complete!"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "========================================================"
