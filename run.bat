@echo off
set "ROOT_DIR=%~dp0"

echo Starting Backend Server...
start "Backend" cmd /k "cd /d ""%ROOT_DIR%backend"" && uvicorn main:app --reload"

echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"

echo Both servers are starting up! Close these command windows to stop them.
