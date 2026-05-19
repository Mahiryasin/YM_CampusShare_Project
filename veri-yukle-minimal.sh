#!/bin/bash
BASE="http://localhost:8082/api"

echo "=== KULLANICILAR KAYDEDILIYOR ==="
# 1. Ali Gedik
U1=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"ali@campus.com","password":"123456","studentNumber":"2021001","firstName":"Ali","lastName":"Gedik"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# 2. Ayse Yilmaz
U2=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"ayse@campus.com","password":"123456","studentNumber":"2021002","firstName":"Ayse","lastName":"Yilmaz"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "Kullanicilar kaydedildi: Ali (ID: $U1), Ayse (ID: $U2)"

echo "=== TOKENLAR ALINIYOR ==="
T1=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d '{"email":"ali@campus.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T2=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d '{"email":"ayse@campus.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
echo "Tokenlar alindi."

echo "=== ILANLAR EKLENIYOR ==="
# Item 1: Canon DSLR owned by Ali (U1), Category: Elektronik
I1=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"title\":\"Canon EOS 90D DSLR\",\"description\":\"Sadece 3 kere kullanildi, hafiza karti dahil.\",\"category\":\"Elektronik\",\"dailyPrice\":200.0,\"condition\":\"NEW\",\"ownerUserId\":$U1}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# Item 2: Kamp Cadiri owned by Ali (U1), Category: Outdoor
I2=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"title\":\"Kamp Cadiri 3 Kisilik\",\"description\":\"Su gecirmez, fermuarlari saglam.\",\"category\":\"Outdoor\",\"dailyPrice\":150.0,\"condition\":\"GOOD\",\"ownerUserId\":$U1}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "Ilanlar eklendi: Canon DSLR (ID: $I1), Kamp Cadiri (ID: $I2)"

echo "=== KIRALAMA OLUSTURULUYOR ==="
# Ayse (U2) rents Ali's (U1) Canon DSLR (I1)
R1=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"itemId\":$I1,\"renterUserId\":$U2,\"ownerUserId\":$U1,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-23\",\"totalPrice\":800.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "Kiralama olusturuldu (ID: $R1)"

echo "=== YORUM EKLENIYOR ==="
# Ayse (U2) reviews Ali (U1) and DSLR (I1)
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"rentalId\":$R1,\"reviewerUserId\":$U2,\"targetUserId\":$U1,\"itemId\":$I1,\"rating\":5,\"comment\":\"Canon DSLR mukemmel durumda teslim edildi, Ali Bey cok ilgiliydi. Cok tesekkurler!\"}" > /dev/null

echo "Yorum eklendi."
echo ""
echo "========================================================================"
echo "                 TEST KULLANICILARI VE GIRIS BILGILERI"
echo "========================================================================"
echo " Ad Soyad     | Ogrenci No | E-posta          | Sifre  | Veritabani ID"
echo " -------------+------------+------------------+--------+---------------"
echo " Ali Gedik    | 2021001    | ali@campus.com   | 123456 | $U1"
echo " Ayse Yilmaz  | 2021002    | ayse@campus.com  | 123456 | $U2"
echo "========================================================================"
echo " ILANLAR VE DÜZGÜN KATEGORILERI:"
echo " - Canon EOS 90D DSLR -> ID: $I1, Kategori: Elektronik"
echo " - Kamp Cadiri 3 Kisilik -> ID: $I2, Kategori: Outdoor"
echo "========================================================================"
