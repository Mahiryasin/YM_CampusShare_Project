# 🎓 CampusShare — Yerel Kurulum Kılavuzu

## ⚙️ Gereksinimler

Aşağıdaki programların bilgisayarında kurulu olması gerekiyor:

| Program | İndirme Adresi |
|---|---|
| **Java 21** | https://www.oracle.com/java/technologies/downloads/#java21 |
| **Node.js 18+** | https://nodejs.org |
| **Docker Desktop** | https://www.docker.com/products/docker-desktop |
| **DBeaver Community** | https://dbeaver.io/download |
| **Maven** (opsiyonel) | Projede `mvnw` mevcut, gerekmez |

---

## 🐳 1. Docker ile SQL Server ve Redis Başlatma

Docker Desktop'ı aç, çalışır hale getir. Sonra bir Terminal aç ve sırayla şu komutları çalıştır:

```bash
# SQL Server (Azure SQL Edge - Mac ARM uyumlu)
docker run -e "ACCEPT_EULA=1" -e "MSSQL_SA_PASSWORD=mahir0506093Aa" \
  -p 1433:1433 --name mssql \
  -d mcr.microsoft.com/azure-sql-edge

# Redis (Önbellek)
docker run -p 6379:6379 --name redis -d redis
```

> ✅ Her iki komut da container ID döndürüyorsa kurulum başarılıdır.

---

## 🗄️ 2. Veritabanlarını Oluşturma (DBeaver)

**DBeaver'ı aç** ve yeni bir SQL Server bağlantısı oluştur:

| Alan | Değer |
|---|---|
| Host | `localhost` |
| Port | `1433` |
| Authentication | SQL Server Authentication |
| Username | `sa` |
| Password | `mahir0506093Aa` |

> Driver seçerken **"Microsoft JDBC Driver"** veya **"SQL Server"** seç. İlk açılışta driver indirmesini isterse **İndir** butonuna bas.

Bağlantı kurulduktan sonra sol panelde bağlantı adına **sağ tıkla → SQL Editor → Open SQL Script** diyerek şu 4 SQL komutunu çalıştır:

```sql
CREATE DATABASE CampusShare_UserDB;
CREATE DATABASE CampusShare_CatalogDB;
CREATE DATABASE CampusShare_RentalDB;
CREATE DATABASE CampusShare_ReviewDB;
```

---

## 📦 3. Frontend Bağımlılıklarını Yükle

Terminal aç, proje klasörüne gir ve şu komutu çalıştır:

```bash
cd /proje-klasoru/app/frontend
npm install
```

> Bu işlem 1-2 dakika sürebilir.

---

## 🚀 4. Projeyi Başlatma

Proje klasörüne git ve `baslat.command` dosyasına **çift tıkla**.

> İlk açılışta Mac güvenlik uyarısı verirse: dosyaya **sağ tıkla → Aç** de.

Birden fazla siyah Terminal penceresi açılacak. Tüm pencerelerde logların akması duraksayıp sakinleşene kadar **yaklaşık 20-30 saniye bekle**.

---

## 💾 5. Örnek Verileri Yükleme

Servisler tamamen ayağa kalktıktan sonra Terminal'de şu komutu çalıştır:

```bash
cd /proje-klasoru
bash veri-yukle.sh
```

Ekranda şu mesajı görürsen başarılıdır:
```
TUM VERILER BASARIYLA YUKLENDI!
```

---

## 🌐 6. Uygulamayı Aç

Tarayıcını aç ve şu adrese git:

**http://localhost:3000**

---

## 👤 Örnek Kullanıcılar

| Ad Soyad | E-posta | Şifre |
|---|---|---|
| Ali Gedik | ali@campus.com | password123 |
| Ayşe Yılmaz | ayse@campus.com | password123 |
| Mehmet Kaya | mehmet@campus.com | password123 |
| Zeynep Çelik | zeynep@campus.com | password123 |
| Emre Demir | emre@campus.com | password123 |
| Fatma Şahin | fatma@campus.com | password123 |
| Barış Arslan | baris@campus.com | password123 |
| Selin Öztürk | selin@campus.com | password123 |
| Can Yıldız | can@campus.com | password123 |
| Merve Koç | merve@campus.com | password123 |

---

## 🔌 Servis Portları (Bilgi)

| Servis | Port |
|---|---|
| Frontend (React) | 3000 |
| API Gateway | 8082 |
| Eureka (Naming Server) | 8061 |
| Catalog Service | 8083 |
| Rental Service | 8084 |
| Review Service | 8085 |
| User Service (App) | 8172 |
| SQL Server | 1433 |
| Redis | 6379 |

---

## ⚠️ Sık Karşılaşılan Sorunlar

**Giriş yapamıyorum:**
→ `veri-yukle.sh` scriptini çalıştırdın mı? Çalıştırmadan önce tüm servislerin ayağa kalkmış olması gerekiyor.

**Servis başlamıyor / port hatası:**
→ Docker Desktop'ın çalışır durumda olduğundan emin ol. `docker start mssql redis` komutunu çalıştır.

**"Connection refused" hatası:**
→ Servislerin tamamen yüklenmesi için biraz daha bekle (30-60 sn).

**Mac güvenlik uyarısı:**
→ `baslat.command` dosyasına **sağ tıkla → Aç** diyerek çalıştır.
