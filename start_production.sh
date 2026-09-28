#!/usr/bin/env bash
# ===================================================
# Metaphrase AI 3.0 — 24/7 Production Startup Script
# ===================================================

set -e

if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "Starting 24/7 Docker containers..."
    docker-compose up --build -d
    echo "Metaphrase AI is running at http://localhost"
    echo "API Docs at http://localhost:8000/docs"
else
    echo "Starting local Python + Node services..."
    source ./venv/bin/activate || true
    nohup uvicorn backend.server:app --host 0.0.0.0 --port 8000 --workers 4 > backend.log 2>&1 &
    cd frontend && nohup npm run preview -- --port 80 --host > frontend.log 2>&1 &
    echo "Services launched in background."
fi
