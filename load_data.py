import json
import urllib.request
import urllib.error
from datetime import date, timedelta

BASE = "http://localhost:8082/api"

def post(url, data, token=None):
    req = urllib.request.Request(
        f"{BASE}{url}",
        data=json.dumps(data).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            **( {"Authorization": f"Bearer {token}"} if token else {} )
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return res_data
    except urllib.error.HTTPError as e:
        print(f"Error calling {url}: {e.read().decode('utf-8')}")
        raise e

print("=== 1. KULLANICILAR KAYDEDILIYOR ===")
users_data = [
    {"email":"ali@campus.com","password":"123456","studentNumber":"2021001","firstName":"Ali","lastName":"Gedik"},
    {"email":"ayse@campus.com","password":"123456","studentNumber":"2021002","firstName":"Ayse","lastName":"Yilmaz"},
    {"email":"mehmet@campus.com","password":"123456","studentNumber":"2021003","firstName":"Mehmet","lastName":"Kaya"},
    {"email":"zeynep@campus.com","password":"123456","studentNumber":"2021004","firstName":"Zeynep","lastName":"Celik"},
    {"email":"emre@campus.com","password":"123456","studentNumber":"2021005","firstName":"Emre","lastName":"Demir"},
    {"email":"fatma@campus.com","password":"123456","studentNumber":"2021006","firstName":"Fatma","lastName":"Sahin"},
    {"email":"baris@campus.com","password":"123456","studentNumber":"2021007","firstName":"Baris","lastName":"Arslan"},
    {"email":"selin@campus.com","password":"123456","studentNumber":"2021008","firstName":"Selin","lastName":"Ozturk"},
    {"email":"can@campus.com","password":"123456","studentNumber":"2021009","firstName":"Can","lastName":"Yildiz"},
    {"email":"merve@campus.com","password":"123456","studentNumber":"2021010","firstName":"Merve","lastName":"Koc"}
]

u = {}
for i, ud in enumerate(users_data, 1):
    res = post("/users/register", ud)
    u[i] = res["id"]

print("10 Kullanici basariyla kaydedildi.")

print("=== 2. TOKENLAR ALINIYOR ===")
t = {}
for i, ud in enumerate(users_data, 1):
    res = post("/users/login", {"email": ud["email"], "password": ud["password"]})
    t[i] = res["token"]

print("Tokenlar basariyla alindi.")

print("=== 3. ILANLAR EKLENIYOR ===")
items_data = [
    # Electronics
    (1, {"title":"Canon EOS 90D DSLR","description":"Sadece 3 kere kullanildi, orjinal kutusunda. Hafiza karti dahil.","category":"Elektronik","dailyPrice":200.0,"condition":"NEW"}),
    (1, {"title":"Profesyonel Tripod","description":"Aluminyum govde, tasima cantasi mevcut.","category":"Elektronik","dailyPrice":50.0,"condition":"GOOD"}),
    (3, {"title":"Sony PlayStation 5 + 2 Kol","description":"FIFA ve GTA dahil. Hafta sonu icin birebir.","category":"Elektronik","dailyPrice":250.0,"condition":"GOOD"}),
    (3, {"title":"Nintendo Switch OLED","description":"Kablo ve dok dahil, ekranda cizik yok.","category":"Elektronik","dailyPrice":200.0,"condition":"GOOD"}),
    (4, {"title":"Drone DJI Mini 2","description":"Uzaktan kumanda ve yedek pil dahil, 4K video cekim.","category":"Elektronik","dailyPrice":400.0,"condition":"GOOD"}),
    (6, {"title":"Projektor Full HD","description":"HDMI ve USB destekli, sunum veya film gecesi icin ideal.","category":"Elektronik","dailyPrice":150.0,"condition":"GOOD"}),
    (9, {"title":"Mini Bluetooth Hoparlor","description":"JBL muadili, su gecirmez, 10 saat batarya omru.","category":"Elektronik","dailyPrice":30.0,"condition":"GOOD"}),
    # Outdoor
    (2, {"title":"Kamp Cadiri 3 Kisilik","description":"Su gecirmez, fermuarlari saglam, kir izi yok.","category":"Outdoor","dailyPrice":150.0,"condition":"GOOD"}),
    (2, {"title":"Uyku Tulumu -5 Derece","description":"Kaz tuyu dolgulu, sik kullanilmamis, temiz.","category":"Outdoor","dailyPrice":80.0,"condition":"GOOD"}),
    (7, {"title":"Cift Kisilik Kamp Hamagi","description":"Dayanikli naylon, 200kg tasima kapasitesi. Kilif dahil.","category":"Outdoor","dailyPrice":30.0,"condition":"NEW"}),
    # Music
    (2, {"title":"Elektrikli Gitar + Amfi","description":"Amfi dahil, baslangic seviyesi icin uygun.","category":"Muzik","dailyPrice":120.0,"condition":"FAIR"}),
    (5, {"title":"Gitar Akustik Yamaha","description":"Teller yeni takildi, ses tonu cok iyi. Kilif dahil.","category":"Muzik","dailyPrice":60.0,"condition":"GOOD"}),
    (8, {"title":"Keman + Yay + Kilif","description":"3/4 boyut, baslangic seviyesi. Kolofon dahil.","category":"Muzik","dailyPrice":70.0,"condition":"FAIR"}),
    # Books & Education
    (1, {"title":"Yazilim Muhendisligi - Sommerville","description":"10. baski, temiz, alti cizili sayfa yok.","category":"Kitap & Egitim","dailyPrice":35.0,"condition":"GOOD"}),
    (3, {"title":"Bilgisayar Aglari - Kurose Ross","description":"8. baski, Turkce notlar var, temiz.","category":"Kitap & Egitim","dailyPrice":30.0,"condition":"FAIR"}),
    (6, {"title":"Isletim Sistemleri - Tanenbaum","description":"4. baski, Ingilizce ders kitabi, temiz.","category":"Kitap & Egitim","dailyPrice":40.0,"condition":"GOOD"}),
    (9, {"title":"Derin Ogrenme Kitabi (Goodfellow)","description":"Ingilizce orijinal baski, cok temiz.","category":"Kitap & Egitim","dailyPrice":45.0,"condition":"GOOD"}),
    (10, {"title":"Boya Seti + Tuval Paketi","description":"40 renk suluboya, 10 tuval, 5 firca dahil. Hobi icin harika.","category":"Kitap & Egitim","dailyPrice":55.0,"condition":"NEW"}),
    # Sport
    (4, {"title":"Elektrikli Scooter","description":"Kampus ici ulasim icin birebir. 40km menzil, sarj aleti dahil.","category":"Spor","dailyPrice":300.0,"condition":"GOOD"}),
    (5, {"title":"Bisiklet - 27.5 Jant Mountain Bike","description":"Vites sistemi sorunsuz. Kilit ve kask dahildir.","category":"Spor","dailyPrice":180.0,"condition":"GOOD"}),
    (4, {"title":"Yoga Mati + Pilates Seti","description":"Kaymaz 6mm yoga mati, pilates topu ve bantlari.","category":"Spor","dailyPrice":40.0,"condition":"NEW"}),
    (7, {"title":"Halter Seti 40 kg","description":"Dambil ve bar dahil, plakalar kilif icinde.","category":"Spor","dailyPrice":50.0,"condition":"GOOD"}),
    # Home & Life
    (5, {"title":"Calisma Masasi Lambasi","description":"LED, goz yormayan, USB sarjli, 5 renk sicakligi.","category":"Ev & Yasam","dailyPrice":20.0,"condition":"NEW"}),
    (6, {"title":"Krep Makinesi + Malzeme Seti","description":"Yeni, 1 kere kullanildi. Soslar ve spatulasi dahil.","category":"Ev & Yasam","dailyPrice":35.0,"condition":"NEW"})
]

items = {}
for idx, (owner_idx, item_details) in enumerate(items_data, 1):
    item_details["ownerUserId"] = u[owner_idx]
    res = post("/catalog/items", item_details, t[owner_idx])
    items[idx] = res["id"]

print("24 urun ilani duzgun kategorilerle eklendi.")

print("=== 4. KIRALAMALAR OLUSTURULUYOR ===")
today = date.today()

rentals_data = [
    # renter_idx, item_idx, owner_idx, start_offset, duration, total, status
    (2, 1, 1, 0, 4, 800.0, "COMPLETED"),
    (3, 8, 2, 0, 3, 450.0, "COMPLETED"),
    (2, 20, 5, 0, 4, 540.0, "COMPLETED"),
    (5, 1, 1, 0, 2, 400.0, "COMPLETED"),
    (6, 5, 4, 0, 2, 800.0, "COMPLETED"),
    (9, 6, 6, 0, 2, 300.0, "COMPLETED"),
    (10, 18, 10, 0, 2, 110.0, "COMPLETED"),
    # Active
    (4, 4, 3, 0, 5, 800.0, "ACTIVE"),
    (1, 10, 7, 0, 3, 60.0, "ACTIVE"),
    # Approved
    (7, 2, 1, 6, 3, 150.0, "APPROVED"),
    (9, 11, 2, 7, 3, 360.0, "APPROVED"),
    (2, 10, 7, 8, 3, 90.0, "APPROVED"),
    # Pending
    (6, 21, 4, 12, 3, 120.0, "PENDING"),
    (3, 17, 9, 13, 3, 135.0, "PENDING"),
    # Rejected & Cancelled
    (1, 3, 3, 0, 1, 250.0, "REJECTED"),
    (10, 24, 6, 0, 2, 70.0, "CANCELLED")
]

rentals = {}
for idx, (renter_idx, item_idx, owner_idx, start_offset, duration, total, status) in enumerate(rentals_data, 1):
    start_date = today + timedelta(days=start_offset)
    end_date = start_date + timedelta(days=duration)
    rental_details = {
        "itemId": items[item_idx],
        "renterUserId": u[renter_idx],
        "ownerUserId": u[owner_idx],
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "totalPrice": total,
        "status": status
    }
    res = post("/rentals", rental_details, t[renter_idx])
    rentals[idx] = res["id"]

print("16 Kiralama islemi farkli durum dagilimlariyla olusturuldu.")

print("=== 5. YORUMLAR EKLENIYOR ===")
reviews_data = [
    # reviewer_idx, target_idx, rental_idx, item_idx, rating, comment
    (2, 1, 1, 1, 5, "DSLR kamera harika durumda teslim edildi, Ali Bey cok yardimci oldu. Kesinlikle tavsiye ederim!"),
    (1, 2, 1, 1, 5, "Zamaninda ve tertemiz getirdi, iletisimi de harikaydi. Guvenilir kiralayan."),
    (3, 2, 2, 8, 5, "Cadir mukemmel durumdaydi. Ayse Hanim cok ilgili ve kibardi."),
    (2, 5, 3, 20, 4, "Bisiklet iyi durumdaydi, ufak tefek vites ayarlari disinda cok memnun kaldim."),
    (5, 1, 4, 1, 5, "Canon DSLR tertemizdi, Ali cok hizli cevap verip yardimci oldu."),
    (6, 4, 5, 5, 5, "Drone ile okul kampusunde harika cekimler yaptik. Zeynep'e tesekkurler!"),
    (9, 6, 6, 6, 4, "Projektor sunumumuzu cok iyi kurtardi. Fatma cok guvenilir bir ev sahibi."),
    (2, 3, 2, 8, 4, "Mehmet urunume zarar vermeden geri getirdi."), # simplified target to prevent validation mismatches
    (4, 6, 5, 5, 5, "Fatma drone'u cok temiz kullandi, zamaninda teslim etti."),
    (6, 9, 6, 6, 5, "Can cok kibar ve dakik bir ogrenci, projektorunu sorunsuz iade aldim.")
]

for reviewer_idx, target_idx, rental_idx, item_idx, rating, comment in reviews_data:
    review_details = {
        "rentalId": rentals[rental_idx],
        "reviewerUserId": u[reviewer_idx],
        "targetUserId": u[target_idx],
        "itemId": items[item_idx],
        "rating": rating,
        "comment": comment
    }
    post("/reviews", review_details, t[reviewer_idx])

print("10 Adet zengin profil yorumu ve puani basariyla eklendi.")
print("\n=======================================================")
print("TUM VERILER BASARIYLA YUKLENDI VE SENKRONIZE EDILDI!")
print("Sisteme giris sifresi: 123456")
print("=======================================================")
