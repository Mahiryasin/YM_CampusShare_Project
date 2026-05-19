# CampusShare — Yeni Kurulum ve Veritabanı Sıfırlama Rehberi

Bu rehber, projenin en güncel versiyonuna geçiş yapmanızı, eski veritabanından kalıcı olarak kurtulmanızı ve zengin test veri setini yükleyerek sistemi sorunsuz çalıştırmanızı adım adım anlatır.

---

## 🛠️ ADIM 1: Eski Dosyalardan ve Değişikliklerden Kurtulma

Eğer bilgisayarınızda eski sürüm kuruluysa ve çakışma yaşamak istemiyorsanız, temiz bir başlangıç için şu komutları uygulayın:

```bash
# Yerelinizdeki çakışan veya değiştirilmiş eski dosyaları sıfırlayın
git reset --hard HEAD
git clean -fd
git pull
```

---

## 💾 ADIM 2: Docker Servislerini Başlatma

Veritabanı temizleme ve yükleme işlemlerinin yapılabilmesi için SQL Server ve Redis Docker konteynerlerinizin çalışıyor olması gerekir:

```bash
# Docker konteynerlerini arka planda başlatın
docker start mssql redis
```

---

## 🧼 ADIM 3: Eski Veritabanından Kurtulma (Sıfırlama)

Eski veya hatalı kategoriler içeren veritabanı kayıtlarından tamamen kurtulmak ve otomatik artan ID sayaçlarını sıfırlamak için hazır Java aracımızı derleyip çalıştırın:

```bash
# Veritabanını temizleyen ve sıfırlayan Java aracını derleyin
javac CleanDb.java

# Java aracını çalıştırarak verileri güvenle temizleyin
java -cp .:/Users/aligedik/.m2/repository/com/microsoft/sqlserver/mssql-jdbc/12.8.1.jre11/mssql-jdbc-12.8.1.jre11.jar CleanDb
```
*(Not: Sürücü yolu Maven yerel deposundaki standart JDBC sürücüsüne yönlendirilmiştir.)*

---

## 🚀 ADIM 4: Projeyi Arka Planda Başlatma

Uygulamanın tüm mikroservislerini ve ön yüzünü tek tek terminal pencereleri açmadan, arka planda güvenle başlatmak için hazırladığımız scripti çalıştırın:

```bash
# Başlatıcıyı çalıştırılabilir yapın ve başlatın
chmod +x baslat_bg.sh
./baslat_bg.sh
```
* **Logları İzlemek İçin:** `tail -f logs/*.log`
* **Servisleri Durdurmak İçin:** `./durdur.sh`

---

## 📊 ADIM 5: Büyük ve Zengin Test Veri Setini Yükleme

Servisler başladıktan sonra (yaklaşık 15-20 saniye bekleyin), **10 kullanıcı, 24 ürün, 16 kiralama ve 10 yorum** içeren gerçekçi test verisini API'ler üzerinden veritabanına yüklemek için scripti çalıştırın:

```bash
# Yükleyiciyi çalıştırılabilir yapın ve çalıştırın
chmod +x veri-yukle-buyuk.sh
./veri-yukle-buyuk.sh
```

---

## 🔑 Test Giriş Bilgileri

Sisteme yüklenen tüm kullanıcıların şifresi **`123456`** olarak ayarlanmıştır:

| Ad Soyad | Öğrenci No | E-posta | Şifre | Veritabanı ID |
| :--- | :--- | :--- | :--- | :--- |
| **Ali Gedik** | `2021001` | `ali@campus.com` | `123456` | `1` |
| **Ayşe Yılmaz** | `2021002` | `ayse@campus.com` | `123456` | `2` |
| **Mehmet Kaya** | `2021003` | `mehmet@campus.com` | `123456` | `3` |
| **Zeynep Çelik** | `2021004` | `zeynep@campus.com` | `123456` | `4` |
| **Emre Demir** | `2021005` | `emre@campus.com` | `123456` | `5` |
| **Fatma Şahin** | `2021006` | `fatma@campus.com` | `123456` | `6` |
| **Barış Arslan** | `2021007` | `baris@campus.com` | `123456` | `7` |
| **Selin Öztürk** | `2021008` | `selin@campus.com` | `123456` | `8` |
| **Can Yıldız** | `2021009` | `can@campus.com` | `123456` | `9` |
| **Merve Koç** | `2021010` | `merve@campus.com` | `123456` | `10` |

Uygulamaya **http://localhost:3000** adresinden ulaşarak zengin kategorileri ve tüm finansal göstergeleri test edebilirsiniz!
