#!/bin/bash
BASE="http://localhost:8082/api"

echo "=== 1. KULLANICILAR KAYDEDILIYOR ==="
U1=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"ali@campus.com","password":"123456","studentNumber":"2021001","firstName":"Ali","lastName":"Gedik"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U2=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"ayse@campus.com","password":"123456","studentNumber":"2021002","firstName":"Ayse","lastName":"Yilmaz"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U3=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"mehmet@campus.com","password":"123456","studentNumber":"2021003","firstName":"Mehmet","lastName":"Kaya"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U4=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"zeynep@campus.com","password":"123456","studentNumber":"2021004","firstName":"Zeynep","lastName":"Celik"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U5=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"emre@campus.com","password":"123456","studentNumber":"2021005","firstName":"Emre","lastName":"Demir"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U6=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"fatma@campus.com","password":"123456","studentNumber":"2021006","firstName":"Fatma","lastName":"Sahin"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U7=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"baris@campus.com","password":"123456","studentNumber":"2021007","firstName":"Baris","lastName":"Arslan"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U8=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"selin@campus.com","password":"123456","studentNumber":"2021008","firstName":"Selin","lastName":"Ozturk"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U9=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"can@campus.com","password":"123456","studentNumber":"2021009","firstName":"Can","lastName":"Yildiz"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
U10=$(curl -s -X POST $BASE/users/register -H "Content-Type: application/json" -d '{"email":"merve@campus.com","password":"123456","studentNumber":"2021010","firstName":"Merve","lastName":"Koc"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "10 Kullanıcı başarıyla kaydedildi."

echo "=== 2. TOKENLAR ALINIYOR ==="
T1=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"ali@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T2=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"ayse@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T3=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"mehmet@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T4=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"zeynep@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T5=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"emre@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T6=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"fatma@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T7=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"baris@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T8=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"selin@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T9=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"can@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
T10=$(curl -s -X POST $BASE/users/login -H "Content-Type: application/json" -d "{\"email\":\"merve@campus.com\",\"password\":\"123456\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Tokenlar başarıyla alındı."

echo "=== 3. ILANLAR EKLENIYOR ==="
# -- Elektronik --
I1=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"title\":\"Canon EOS 90D DSLR\",\"description\":\"Sadece 3 kere kullanildi, orjinal kutusunda. Hafiza karti dahil.\",\"category\":\"Elektronik\",\"dailyPrice\":200.0,\"condition\":\"NEW\",\"ownerUserId\":$U1}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I2=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"title\":\"Profesyonel Tripod\",\"description\":\"Aluminyum govde, tasima cantasi mevcut.\",\"category\":\"Elektronik\",\"dailyPrice\":50.0,\"condition\":\"GOOD\",\"ownerUserId\":$U1}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I3=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T3" -d "{\"title\":\"Sony PlayStation 5 + 2 Kol\",\"description\":\"FIFA ve GTA dahil. Hafta sonu icin birebir.\",\"category\":\"Elektronik\",\"dailyPrice\":250.0,\"condition\":\"GOOD\",\"ownerUserId\":$U3}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I4=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T3" -d "{\"title\":\"Nintendo Switch OLED\",\"description\":\"Kablo ve dok dahil, ekranda cizik yok.\",\"category\":\"Elektronik\",\"dailyPrice\":200.0,\"condition\":\"GOOD\",\"ownerUserId\":$U3}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I5=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T4" -d "{\"title\":\"Drone DJI Mini 2\",\"description\":\"Uzaktan kumanda ve yedek pil dahil, 4K video cekim.\",\"category\":\"Elektronik\",\"dailyPrice\":400.0,\"condition\":\"GOOD\",\"ownerUserId\":$U4}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I6=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"title\":\"Projektor Full HD\",\"description\":\"HDMI ve USB destekli, sunum veya film gecesi icin ideal.\",\"category\":\"Elektronik\",\"dailyPrice\":150.0,\"condition\":\"GOOD\",\"ownerUserId\":$U6}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I7=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T9" -d "{\"title\":\"Mini Bluetooth Hoparlor\",\"description\":\"JBL muadili, su gecirmez, 10 saat batarya omru.\",\"category\":\"Elektronik\",\"dailyPrice\":30.0,\"condition\":\"GOOD\",\"ownerUserId\":$U9}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# -- Outdoor --
I8=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"title\":\"Kamp Cadiri 3 Kisilik\",\"description\":\"Su gecirmez, fermuarlari saglam, kir izi yok.\",\"category\":\"Outdoor\",\"dailyPrice\":150.0,\"condition\":\"GOOD\",\"ownerUserId\":$U2}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I9=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"title\":\"Uyku Tulumu -5 Derece\",\"description\":\"Kaz tuyu dolgulu, sik kullanilmamis, temiz.\",\"category\":\"Outdoor\",\"dailyPrice\":80.0,\"condition\":\"GOOD\",\"ownerUserId\":$U2}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I10=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T7" -d "{\"title\":\"Cift Kisilik Kamp Hamagi\",\"description\":\"Dayanikli naylon, 200kg tasima kapasitesi. Kilif dahil.\",\"category\":\"Outdoor\",\"dailyPrice\":30.0,\"condition\":\"NEW\",\"ownerUserId\":$U7}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# -- Muzik --
I11=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"title\":\"Elektrikli Gitar + Amfi\",\"description\":\"Amfi dahil, baslangic seviyesi icin uygun.\",\"category\":\"Müzik\",\"dailyPrice\":120.0,\"condition\":\"FAIR\",\"ownerUserId\":$U2}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I12=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T5" -d "{\"title\":\"Gitar Akustik Yamaha\",\"description\":\"Teller yeni takildi, ses tonu cok iyi. Kilif dahil.\",\"category\":\"Müzik\",\"dailyPrice\":60.0,\"condition\":\"GOOD\",\"ownerUserId\":$U5}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I13=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T8" -d "{\"title\":\"Keman + Yay + Kilif\",\"description\":\"3/4 boyut, baslangic seviyesi. Kolofon dahil.\",\"category\":\"Müzik\",\"dailyPrice\":70.0,\"condition\":\"FAIR\",\"ownerUserId\":$U8}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# -- Kitap & Egitim --
I14=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"title\":\"Yazilim Muhendisligi - Sommerville\",\"description\":\"10. baski, temiz, alti cizili sayfa yok.\",\"category\":\"Kitap & Eğitim\",\"dailyPrice\":35.0,\"condition\":\"GOOD\",\"ownerUserId\":$U1}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I15=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T3" -d "{\"title\":\"Bilgisayar Aglari - Kurose Ross\",\"description\":\"8. baski, Turkce notlar var, temiz.\",\"category\":\"Kitap & Eğitim\",\"dailyPrice\":30.0,\"condition\":\"FAIR\",\"ownerUserId\":$U3}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I16=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"title\":\"Isletim Sistemleri - Tanenbaum\",\"description\":\"4. baski, Ingilizce ders kitabi, temiz.\",\"category\":\"Kitap & Eğitim\",\"dailyPrice\":40.0,\"condition\":\"GOOD\",\"ownerUserId\":$U6}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I17=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T9" -d "{\"title\":\"Derin Ogrenme Kitabi (Goodfellow)\",\"description\":\"Ingilizce orijinal baski, cok temiz.\",\"category\":\"Kitap & Eğitim\",\"dailyPrice\":45.0,\"condition\":\"GOOD\",\"ownerUserId\":$U9}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I18=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T10" -d "{\"title\":\"Boya Seti + Tuval Paketi\",\"description\":\"40 renk suluboya, 10 tuval, 5 firca dahil. Hobi icin harika.\",\"category\":\"Kitap & Eğitim\",\"dailyPrice\":55.0,\"condition\":\"NEW\",\"ownerUserId\":$U10}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# -- Spor --
I19=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T4" -d "{\"title\":\"Elektrikli Scooter\",\"description\":\"Kampus ici ulasim icin birebir. 40km menzil, sarj aleti dahil.\",\"category\":\"Spor\",\"dailyPrice\":300.0,\"condition\":\"GOOD\",\"ownerUserId\":$U4}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I20=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T5" -d "{\"title\":\"Bisiklet - 27.5 Jant Mountain Bike\",\"description\":\"Vites sistemi sorunsuz. Kilit ve kask dahildir.\",\"category\":\"Spor\",\"dailyPrice\":180.0,\"condition\":\"GOOD\",\"ownerUserId\":$U5}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I21=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T4" -d "{\"title\":\"Yoga Mati + Pilates Seti\",\"description\":\"Kaymaz 6mm yoga mati, pilates topu ve bantlari.\",\"category\":\"Spor\",\"dailyPrice\":40.0,\"condition\":\"NEW\",\"ownerUserId\":$U4}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I22=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T7" -d "{\"title\":\"Halter Seti 40 kg\",\"description\":\"Dambil ve bar dahil, plakalar kilif icinde.\",\"category\":\"Spor\",\"dailyPrice\":50.0,\"condition\":\"GOOD\",\"ownerUserId\":$U7}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# -- Ev & Yasam --
I23=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T5" -d "{\"title\":\"Calisma Masasi Lambasi\",\"description\":\"LED, goz yormayan, USB sarjli, 5 renk sicakligi.\",\"category\":\"Ev & Yaşam\",\"dailyPrice\":20.0,\"condition\":\"NEW\",\"ownerUserId\":$U5}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
I24=$(curl -s -X POST $BASE/catalog/items -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"title\":\"Krep Makinesi + Malzeme Seti\",\"description\":\"Yeni, 1 kere kullanildi. Soslar ve spatulasi dahil.\",\"category\":\"Ev & Yaşam\",\"dailyPrice\":35.0,\"condition\":\"NEW\",\"ownerUserId\":$U6}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "24 Ürün İlanı düzgün kategorilerle eklendi."

echo "=== 4. KIRALAMALAR OLUSTURULUYOR ==="
# Completed (Tamamlandı) -> Kazanç ve Harcamaya DAHİL
R1=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"itemId\":$I1,\"renterUserId\":$U2,\"ownerUserId\":$U1,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-23\",\"totalPrice\":800.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R2=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T3" -d "{\"itemId\":$I8,\"renterUserId\":$U3,\"ownerUserId\":$U2,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-22\",\"totalPrice\":450.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R3=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"itemId\":$I20,\"renterUserId\":$U2,\"ownerUserId\":$U5,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-23\",\"totalPrice\":540.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R4=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T5" -d "{\"itemId\":$I1,\"renterUserId\":$U5,\"ownerUserId\":$U1,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-21\",\"totalPrice\":400.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R5=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"itemId\":$I5,\"renterUserId\":$U6,\"ownerUserId\":$U4,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-22\",\"totalPrice\":800.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R6=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T9" -d "{\"itemId\":$I6,\"renterUserId\":$U9,\"ownerUserId\":$U6,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-21\",\"totalPrice\":300.0,\"status\":\"COMPLETED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# Active (Devam Ediyor) -> Kazanç ve Harcamaya DAHİL
R7=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T8" -d "{\"itemId\":$I19,\"renterUserId\":$U8,\"ownerUserId\":$U4,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-26\",\"totalPrice\":2100.0,\"status\":\"ACTIVE\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R8=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T4" -d "{\"itemId\":$I4,\"renterUserId\":$U4,\"ownerUserId\":$U3,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-24\",\"totalPrice\":800.0,\"status\":\"ACTIVE\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R9=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"itemId\":$I10,\"renterUserId\":$U1,\"ownerUserId\":$U7,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-22\",\"totalPrice\":60.0,\"status\":\"ACTIVE\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# Approved (Onaylandı) -> Kazanç ve Harcamaya DAHİL
R10=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T7" -d "{\"itemId\":$I2,\"renterUserId\":$U7,\"ownerUserId\":$U1,\"startDate\":\"2026-05-25\",\"endDate\":\"2026-05-28\",\"totalPrice\":150.0,\"status\":\"APPROVED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R11=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T9" -d "{\"itemId\":$I11,\"renterUserId\":$U9,\"ownerUserId\":$U2,\"startDate\":\"2026-05-26\",\"endDate\":\"2026-05-29\",\"totalPrice\":360.0,\"status\":\"APPROVED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R12=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"itemId\":$I10,\"renterUserId\":$U2,\"ownerUserId\":$U7,\"startDate\":\"2026-05-27\",\"endDate\":\"2026-05-30\",\"totalPrice\":90.0,\"status\":\"APPROVED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# Pending (Beklemede) -> Kazanç ve Harcamaya DAHİL DEĞİL
R13=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"itemId\":$I21,\"renterUserId\":$U6,\"ownerUserId\":$U4,\"startDate\":\"2026-06-01\",\"endDate\":\"2026-06-04\",\"totalPrice\":120.0,\"status\":\"PENDING\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R14=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T3" -d "{\"itemId\":$I17,\"renterUserId\":$U3,\"ownerUserId\":$U9,\"startDate\":\"2026-06-02\",\"endDate\":\"2026-06-05\",\"totalPrice\":135.0,\"status\":\"PENDING\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# Rejected & Cancelled (Reddedildi & İptal) -> Kazanç ve Harcamaya DAHİL DEĞİL (Az önce çözdüğümüz hata!)
R15=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"itemId\":$I3,\"renterUserId\":$U1,\"ownerUserId\":$U3,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-20\",\"totalPrice\":250.0,\"status\":\"REJECTED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
R16=$(curl -s -X POST $BASE/rentals -H "Content-Type: application/json" -H "Authorization: Bearer $T10" -d "{\"itemId\":$I24,\"renterUserId\":$U10,\"ownerUserId\":$U6,\"startDate\":\"2026-05-19\",\"endDate\":\"2026-05-21\",\"totalPrice\":70.0,\"status\":\"CANCELLED\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "16 Kiralama işlemi farklı durum dağılımlarıyla oluşturuldu."

echo "=== 5. YORUMLAR EKLENIYOR ==="
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"rentalId\":$R1,\"reviewerUserId\":$U2,\"targetUserId\":$U1,\"itemId\":$I1,\"rating\":5,\"comment\":\"DSLR kamera harika durumda teslim edildi, Ali Bey cok yardimci oldu. Kesinlikle tavsiye ederim!\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T1" -d "{\"rentalId\":$R1,\"reviewerUserId\":$U1,\"targetUserId\":$U2,\"itemId\":$I1,\"rating\":5,\"comment\":\"Zamaninda ve tertemiz getirdi, iletisimi de harikaydi. Guvenilir kiralayan.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T3" -d "{\"rentalId\":$R2,\"reviewerUserId\":$U3,\"targetUserId\":$U2,\"itemId\":$I8,\"rating\":5,\"comment\":\"Cadir mukemmel durumdaydi. Ayse Hanim cok ilgili ve kibardi.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"rentalId\":$R3,\"reviewerUserId\":$U2,\"targetUserId\":$U5,\"itemId\":$I20,\"rating\":4,\"comment\":\"Bisiklet iyi durumdaydi, ufak tefek vites ayarlari disinda cok memnun kaldim.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T5" -d "{\"rentalId\":$R4,\"reviewerUserId\":$U5,\"targetUserId\":$U1,\"itemId\":$I1,\"rating\":5,\"comment\":\"Canon DSLR tertemizdi, Ali cok hizli cevap verip yardimci oldu.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"rentalId\":$R5,\"reviewerUserId\":$U6,\"targetUserId\":$U4,\"itemId\":$I5,\"rating\":5,\"comment\":\"Drone ile okul kampusunde harika cekimler yaptik. Zeynep'e tesekkurler!\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T9" -d "{\"rentalId\":$R6,\"reviewerUserId\":$U9,\"targetUserId\":$U6,\"itemId\":$I6,\"rating\":4,\"comment\":\"Projektor sunumumuzu cok iyi kurtardi. Fatma cok guvenilir bir ev sahibi.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T2" -d "{\"rentalId\":$R2,\"reviewerUserId\":$U2,\"targetUserId\":$U3,\"itemId\":$I8,\"rating\":4,\"comment\":\"Mehmet guvenilir bir kiralayan, urunume zarar vermeden geri getirdi.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T4" -d "{\"rentalId\":$R5,\"reviewerUserId\":$U4,\"targetUserId\":$U6,\"itemId\":$I5,\"rating\":5,\"comment\":\"Fatma drone'u cok temiz kullandi, zamaninda teslim etti.\"}" > /dev/null
curl -s -X POST $BASE/reviews -H "Content-Type: application/json" -H "Authorization: Bearer $T6" -d "{\"rentalId\":$R6,\"reviewerUserId\":$U6,\"targetUserId\":$U9,\"itemId\":$I6,\"rating\":5,\"comment\":\"Can cok kibar ve dakik bir ogrenci, projektorunu sorunsuz iade aldim.\"}" > /dev/null

echo "10 Adet zengin profil yorumu ve puanı başarıyla eklendi."
echo ""
echo "=========================================================================================="
echo "                   ZENGİN TEST KULLANICILARI VE GIRIS BILGILERI"
echo "=========================================================================================="
echo " Ad Soyad       | Ogrenci No | E-posta           | Sifre  | Veritabani ID"
echo " ---------------+------------+-------------------+--------+-------------------------------"
echo " Ali Gedik      | 2021001    | ali@campus.com    | 123456 | $U1"
echo " Ayse Yilmaz    | 2021002    | ayse@campus.com   | 123456 | $U2"
echo " Mehmet Kaya    | 2021003    | mehmet@campus.com | 123456 | $U3"
echo " Zeynep Celik   | 2021004    | zeynep@campus.com | 123456 | $U4"
echo " Emre Demir     | 2021005    | emre@campus.com   | 123456 | $U5"
echo " Fatma Sahin    | 2021006    | fatma@campus.com  | 123456 | $U6"
echo " Baris Arslan   | 2021007    | baris@campus.com  | 123456 | $U7"
echo " Selin Ozturk   | 2021008    | selin@campus.com  | 123456 | $U8"
echo " Can Yildiz     | 2021009    | can@campus.com    | 123456 | $U9"
echo " Merve Koc      | 2021010    | merve@campus.com  | 123456 | $U10"
echo "=========================================================================================="
echo " BÜTÜN KATEGORİLER VE ILANLAR TAMAMEN SENKRONIZE EDİLDİ!"
echo " Giriş Yapıp Harika Bir Deneyim Yaşayabilirsiniz: http://localhost:3000"
echo "=========================================================================================="
