#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "========================================="
echo "   CampusShare baslatiliyor..."
echo "========================================="

# Docker (SQL Server + Redis) baslat
echo "[1/3] Docker servisleri baslatiliyor..."
docker start mssql redis > /dev/null 2>&1
sleep 2

# Naming Server
echo "[2/3] Naming Server (Eureka) baslatiliyor..."
osascript -e "tell app \"Terminal\" to do script \"echo '=== NAMING SERVER (8061) ==='; cd '$DIR/naming-server' && ../app/mvnw spring-boot:run\""
sleep 12

# API Gateway + Mikroservisler
echo "[3/3] Diger servisler baslatiliyor..."
osascript -e "tell app \"Terminal\" to do script \"echo '=== API GATEWAY (8082) ==='; cd '$DIR/api-gateway' && ../app/mvnw spring-boot:run\""
sleep 3
osascript -e "tell app \"Terminal\" to do script \"echo '=== CATALOG SERVICE (8083) ==='; cd '$DIR/catalog-service' && ../app/mvnw spring-boot:run\""
osascript -e "tell app \"Terminal\" to do script \"echo '=== RENTAL SERVICE (8084) ==='; cd '$DIR/rental-service' && ../app/mvnw spring-boot:run\""
osascript -e "tell app \"Terminal\" to do script \"echo '=== REVIEW SERVICE (8085) ==='; cd '$DIR/review-service' && ../app/mvnw spring-boot:run\""
osascript -e "tell app \"Terminal\" to do script \"echo '=== USER SERVICE (8172) ==='; cd '$DIR/app' && ./mvnw spring-boot:run\""
osascript -e "tell app \"Terminal\" to do script \"echo '=== FRONTEND (3000) ==='; cd '$DIR/app/frontend' && npm run dev\""

echo ""
echo "========================================="
echo " Tum servisler baslatildi!"
echo " ~20 saniye bekleyip tarayicinizi acin:"
echo " http://localhost:3000"
echo "========================================="
