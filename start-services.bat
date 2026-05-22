@echo off
REM Badminton Platform - Startup Script (Windows)
REM Starts all microservices in the correct order

cd /d "%~dp0"

echo ========================================
echo Badminton Platform Startup
echo ========================================
echo.

REM Check infrastructure services
echo Checking Infrastructure Services...
echo.

REM Check PostgreSQL
netstat -an | findstr :5432 > nul
if errorlevel 1 (
    echo [ERROR] PostgreSQL (port 5432) is not running!
    echo Please start PostgreSQL first:
    echo   - Docker: docker start badminton-postgres
    echo   - Or start PostgreSQL service
    echo.
    pause
    exit /b 1
)
echo [OK] PostgreSQL is running

REM Check MongoDB
netstat -an | findstr :27017 > nul
if errorlevel 1 (
    echo [ERROR] MongoDB (port 27017) is not running!
    echo Please start MongoDB
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB is running

REM Check Redis
netstat -an | findstr :6379 > nul
if errorlevel 1 (
    echo [ERROR] Redis (port 6379) is not running!
    echo Please start Redis
    echo.
    pause
    exit /b 1
)
echo [OK] Redis is running

REM Check Kafka
netstat -an | findstr :9094 > nul
if errorlevel 1 (
    echo [ERROR] Kafka (port 9094) is not running!
    echo Please start Kafka
    echo.
    pause
    exit /b 1
)
echo [OK] Kafka is running
echo.
echo All infrastructure services are running!
echo.

REM Start services
echo Starting microservices...
echo.

start "Service Registry" cmd /c "cd backend\serviceRegistry && mvnw spring-boot:run -Dspring-boot.run.profiles=default"
timeout /t 5 /nobreak > nul

REM Config Server is disabled - removed from startup
echo Config Server is disabled (removed from project)
echo.

start "Identity Service" cmd /c "cd backend\identity-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 3 /nobreak > nul

start "Venue Service" cmd /c "cd backend\venue-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 3 /nobreak > nul

start "Booking Service" cmd /c "cd backend\booking-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 3 /nobreak > nul

start "Payment Service" cmd /c "cd backend\payment-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 3 /nobreak > nul

start "Community Service" cmd /c "cd backend\community-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 3 /nobreak > nul

start "Notification Service" cmd /c "cd backend\notification-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 3 /nobreak > nul

start "Recommendation Service" cmd /c "cd backend\recommendation-service && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
timeout /t 10 /nobreak > nul

start "API Gateway" cmd /c "cd backend\api-gateway && mvnw spring-boot:run -Dspring-boot.run.profiles=dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Service URLs:
echo   API Gateway:        http://localhost:8080
echo   Service Registry:   http://localhost:8761
echo   Identity Service:   http://localhost:8081
echo   Venue Service:      http://localhost:8082
echo   Booking Service:    http://localhost:8083
echo   Payment Service:    http://localhost:8084
echo   Community Service:  http://localhost:8085
echo   Notification Service: http://localhost:8086
echo   Recommendation Service: http://localhost:8087
echo.
echo All services are running in separate windows.
echo Check each window for logs.
echo.
pause
