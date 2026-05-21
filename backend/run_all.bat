@echo off
echo ========================================================
echo   Badminton Platform - Auto Starter
echo ========================================================
REM Ordered starter: infrastructure -> registry -> config -> services -> gateway
setlocal enabledelayedexpansion

echo ========================================================
echo   Badminton Platform - Ordered Auto Starter
echo ========================================================

REM 1) Start infrastructure (docker-compose) in a separate window. Comment out if not needed.
echo Starting infrastructure (docker-compose) in ..\infrastructure ...
start "Docker-Compose" cmd /k "cd ..\infrastructure && docker-compose up -d"
echo Waiting 20 seconds for infrastructure to settle...
timeout /t 20 >nul

REM Build shared library module 'common' so services depending on it have artifacts available
echo Building common module (package)...
mvnw.cmd -pl common -am -DskipTests package
echo common build finished.
timeout /t 2 >nul

REM Helper: start a service in its folder using mvnw
:startService
REM %1 = window title, %2 = folder
set "TITLE=%~1"
set "FOLDER=%~2"
echo Starting %TITLE% (folder=%FOLDER%)...
start "%TITLE%" cmd /k "cd %FOLDER% && mvnw.cmd spring-boot:run"
timeout /t 5 >nul
goto :eof

REM Helper: wait for URL to respond (uses PowerShell). Args: name url timeoutSec
:waitForUrl
set "WAIT_NAME=%~1"
set "WAIT_URL=%~2"
set /a WAIT_TIMEOUT=%~3
echo Waiting for %WAIT_NAME% at %WAIT_URL% (timeout %WAIT_TIMEOUT%s)...
set /a ELAPSED=0
:waitloop
powershell -Command "try { Invoke-WebRequest -UseBasicParsing -Uri '%WAIT_URL%' -Method GET -TimeoutSec 5 > $null; exit 0 } catch { exit 1 }"
if %errorlevel%==0 (
	echo %WAIT_NAME% is available.
	goto :eof
)
if %ELAPSED% GEQ %WAIT_TIMEOUT% (
	echo Timeout waiting for %WAIT_NAME% (%WAIT_URL%). Continuing...
	goto :eof
)
timeout /t 5 >nul
set /a ELAPSED+=5
goto waitloop

REM Start discovery (Eureka)
call :startService "Eureka-Server" serviceRegistry
call :waitForUrl "Eureka-Server" "http://localhost:8761/actuator/health" 120

REM Start config server
call :startService "Config-Server" configServer
call :waitForUrl "Config-Server" "http://localhost:8888/actuator/health" 120

REM Start core services in order. Add or remove entries as your project requires.
call :startService "Identity-Service" identity-service
call :waitForUrl "Identity-Service" "http://localhost:8081/actuator/health" 60

call :startService "Venue-Service" venue-service
timeout /t 5 >nul

call :startService "Booking-Service" booking-service
timeout /t 5 >nul

call :startService "Community-Service" community-service
timeout /t 5 >nul

call :startService "Notification-Service" notification-service
timeout /t 5 >nul

call :startService "Recommendation-Service" recommendation-service
timeout /t 5 >nul

call :startService "Payment-Service" payment-service
timeout /t 5 >nul

REM Start API gateway last
REM Build and start API gateway last
echo Building api-gateway module (package)...
mvnw.cmd -pl api-gateway -DskipTests package
echo api-gateway build finished.
timeout /t 2 >nul
call :startService "API-Gateway" api-gateway
call :waitForUrl "API-Gateway" "http://localhost:8882/actuator/health" 60

echo ========================================================
echo   All starters launched. Check individual windows for logs.
echo ========================================================
pause
