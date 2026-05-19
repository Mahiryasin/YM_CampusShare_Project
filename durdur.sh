#!/bin/bash

echo "=================================================="
echo "   CampusShare Servisleri Durduruluyor..."
echo "=================================================="

# Java spring-boot süreçlerini sonlandır
pids=$(ps -ef | grep spring-boot | grep -v grep | awk '{print $2}')
if [ -n "$pids" ]; then
    echo "Spring Boot süreçleri sonlandırılıyor (PIDs: $pids)..."
    kill -9 $pids
else
    echo "Çalışan Spring Boot süreci bulunamadı."
fi

# Node frontend sürecini sonlandır
node_pids=$(ps -ef | grep vite | grep -v grep | awk '{print $2}')
if [ -n "$node_pids" ]; then
    echo "Frontend (Vite/Node) süreçleri sonlandırılıyor..."
    kill -9 $node_pids
else
    echo "Çalışan Frontend süreci bulunamadı."
fi

echo "=================================================="
echo " Tüm servisler durduruldu."
echo "=================================================="
