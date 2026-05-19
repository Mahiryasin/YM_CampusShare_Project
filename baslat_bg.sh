#!/bin/bash

# Proje ana dizinini bul
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mkdir -p "$DIR/logs"

echo "=================================================="
echo "   CampusShare - Arka Plan Başlatıcı (Safe Mode)"
echo "=================================================="

# Docker start (zaten çalışıyorsa sorun yok)
echo "[1/3] Docker servisleri kontrol ediliyor..."
docker start mssql redis > /dev/null 2>&1
sleep 1

# Servis başlatma fonksiyonu
start_service() {
    local name=$1
    local path=$2
    local cmd=$3
    local delay=$4

    echo "⚡ $name başlatılıyor..."
    cd "$DIR/$path" || exit
    nohup $cmd > "$DIR/logs/${name// /_}.log" 2>&1 &
    local pid=$!
    echo "✅ $name arka planda başladı. PID: $pid (Log: logs/${name// /_}.log)"
    sleep $delay
}

# 1. Naming Server
start_service "Naming Server" "naming-server" "../app/mvnw spring-boot:run" 12

# 2. API Gateway
start_service "API Gateway" "api-gateway" "../app/mvnw spring-boot:run" 3

# 3. Catalog Service
start_service "Catalog Service" "catalog-service" "../app/mvnw spring-boot:run" 2

# 4. Rental Service
start_service "Rental Service" "rental-service" "../app/mvnw spring-boot:run" 2

# 5. Review Service
start_service "Review Service" "review-service" "../app/mvnw spring-boot:run" 2

# 6. User Service
start_service "User Service" "app" "./mvnw spring-boot:run" 2

# 7. Frontend
start_service "React Frontend" "app/frontend" "npm run dev" 2

echo "=================================================="
echo " Tüm servisler arka planda başlatıldı!"
echo " Logları izlemek için: tail -f logs/*.log"
echo " Servisleri durdurmak için: ./durdur.sh"
echo " Tarayıcınızdan açın: http://localhost:3000"
echo "=================================================="
