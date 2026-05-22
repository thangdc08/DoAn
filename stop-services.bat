@echo off
REM Badminton Platform - Stop Services Script (Windows)

cd /d "%~dp0"

echo Stopping all badminton platform services...

REM List of services (PID files would be needed for proper cleanup)
REM For now, we'll just provide instructions

echo.
echo To stop services, you can:
echo 1. Close all command windows that are running services
echo 2. Or use Task Manager to kill Java processes
echo 3. Or run: taskkill /F /IM java.exe
echo.
echo Note: A more graceful shutdown can be implemented with PID tracking.
echo.
pause
