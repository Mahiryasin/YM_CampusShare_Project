@echo off
echo Starting Naming Server...
cd naming-server
start "Naming Server" cmd /k "..\app\mvnw.cmd spring-boot:run"
cd ..
timeout /t 15

echo Starting API Gateway...
cd api-gateway
start "API Gateway" cmd /k "..\app\mvnw.cmd spring-boot:run"
cd ..
timeout /t 10

echo Starting Catalog Service...
cd catalog-service
start "Catalog Service" cmd /k "..\app\mvnw.cmd spring-boot:run"
cd ..

echo Starting Rental Service...
cd rental-service
start "Rental Service" cmd /k "..\app\mvnw.cmd spring-boot:run"
cd ..

echo Starting Review Service...
cd review-service
start "Review Service" cmd /k "..\app\mvnw.cmd spring-boot:run"
cd ..

echo Starting App Service...
cd app
start "App Service" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo Starting Frontend...
cd app\frontend
start "Frontend" cmd /k "npm run dev"
cd ..\..

echo All services started!
