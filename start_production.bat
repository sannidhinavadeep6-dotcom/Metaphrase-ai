@echo off
echo ===================================================
echo Starting Metaphrase AI 3.0 Enterprise (24/7 Mode)
echo ===================================================

where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/2] Docker detected. Starting 24/7 containers with restart=always...
    docker-compose up --build -d
    echo [2/2] Production stack is live!
    echo Access Web App at: http://localhost
    echo Access API Docs at: http://localhost:8000/docs
    goto end
)

echo Docker not detected. Launching local 24/7 background services...
start /b .\venv\Scripts\python.exe -m uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
cd frontend
start /b npm.cmd run preview -- --port 80 --host
cd ..
echo Services started!
echo Frontend: http://localhost:80
echo Backend:  http://localhost:8000

:end
pause
