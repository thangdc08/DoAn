@echo off
echo ========================================================
echo   Badminton Platform - Auto Starter
echo ========================================================

echo Starting Service Registry (Eureka) on port 8761...
start "Eureka-Server" cmd /k "cd serviceRegistry && mvnw.cmd spring-boot:run"
timeout /t 15

echo Starting Config Server on port 8888...
start "Config-Server" cmd /k "cd configServer && mvnw.cmd spring-boot:run"
timeout /t 15

echo Starting Identity Service on port 8081...
start "Identity-Service" cmd /k "cd identity-service && mvnw.cmd spring-boot:run"

echo Starting API Gateway on port 8882...
start "API-Gateway" cmd /k "cd api-gateway && mvnw.cmd spring-boot:run"

echo ========================================================
echo   He thong dang khoi dong. Vui long doi...
echo ========================================================
pause
