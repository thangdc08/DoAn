@echo off
setlocal enabledelayedexpansion

echo Killing all Java processes...
taskkill /F /IM java.exe 2>nul
timeout /t 3

echo.
echo ========================================
echo Starting Eureka Server (port 8761)...
echo ========================================
cd /d "%~dp0serviceRegistry"
start "Eureka-Server" mvnw spring-boot:run
timeout /t 20

echo.
echo ========================================
echo Starting Booking Service (port 8083)...
echo ========================================
cd /d "%~dp0booking-service"
start "Booking-Service" mvnw spring-boot:run
timeout /t 15

echo.
echo ========================================
echo Starting API Gateway (port 8080)...
echo ========================================
cd /d "%~dp0api-gateway"
start "API-Gateway" mvnw spring-boot:run

echo.
echo ========================================
echo Services starting! Check opened windows.
echo ========================================
echo Eureka: http://localhost:8761
echo Gateway: http://localhost:8080
echo.
pause
