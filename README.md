# 🎓 CampusShare (Kampüs İçi Paylaşım Platformu)

CampusShare, öğrencilerin kullanmadıkları eşyalarını (elektronik, kitap, spor aletleri vb.) kampüs içindeki diğer öğrencilerle güvenli bir şekilde kiralamasını ve paylaşmasını sağlayan, doğrulanmış öğrenci profilleri ve güven puanı sistemine dayalı bir platformdur.

## 🚀 Özellikler
- **Doğrulanmış Profiller:** Yalnızca `edu.tr` uzantılı e-postaya sahip öğrenciler sisteme kayıt olabilir.
- **Güven Puanı Sistemi:** Her kiralama sonrası yapılan değerlendirmelerle (review) kullanıcıların kampüs içi itibar puanı oluşur.
- **Gelişmiş Katalog:** İhtiyaç duyulan eşyalar kategorilere göre hızlıca aranabilir ve filtrelenebilir.
- **Mikroservis Mimarisi:** Yüksek performans ve ölçeklenebilirlik için sistem bağımsız servislere bölünmüştür.
- **Güvenli JWT Yetkilendirmesi:** Stateless mimari ile güvenli oturum yönetimi.

## 🛠 Kullanılan Teknolojiler

**Frontend (Kullanıcı Arayüzü):**
- React.js (Vite)
- Material-UI (MUI v6)
- TailwindCSS
- Axios (API haberleşmesi)

**Backend (Sunucu & İş Mantığı):**
- Java 21 & Spring Boot 3
- Spring Cloud (Netflix Eureka, API Gateway)
- Spring Security (JWT)

**Veritabanı ve Önbellek:**
- MS SQL Server (Veri Kalıcılığı)
- Redis (Önbellekleme / Caching)

## ⚙️ Kurulum Adımları

Projeyi kendi yerel (local) bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### Ön Gereksinimler
- Java Development Kit (JDK) 21
- Node.js (v18 veya üzeri)
- MS SQL Server
- Redis Server (Port: 6379)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadiniz/YM_Project.git
cd YM_Project
```

### 2. Backend Servislerini Başlatın
Mikroservislerin doğru çalışabilmesi için servisleri **sırasıyla** başlatmanız gerekmektedir:
1. `naming-server` (Eureka Discovery - Port: 8061)
2. `api-gateway` (Port: 8082)
3. `app` (User Service - Port: 8172)
4. `catalog-service`, `rental-service`, `review-service`

**(Windows İçin Hızlı Başlatma):** Proje ana dizinindeki `start_all.bat` dosyasını çalıştırarak veya `mvnw spring-boot:run` komutunu her servisin dizininde ayrı ayrı çalıştırarak sistemi ayağa kaldırabilirsiniz.

### 3. Frontend'i Başlatın
Yeni bir terminal açın ve frontend klasörüne gidin:
```bash
cd app/frontend
npm install
npm run dev
```
Uygulama `http://localhost:3000` (veya `3001`) adresinde çalışmaya başlayacaktır.

## 📖 Kullanım
1. Tarayıcınızdan uygulamayı açın.
2. **Kayıt Ol** ekranından üniversite e-postanız ile bir hesap oluşturun.
3. Giriş yaptıktan sonra **Kataloğa Git** butonu ile kiralık eşyaları listeleyin.
4. Kendi eşyanızı kiralamak için sağ üstten **İlan Oluştur** sayfasına gidin.

## 🤝 Katkı (Contribution)
Bu proje açık kaynağa dönük geliştirilmektedir. Katkıda bulunmak isterseniz:
1. Projeyi Fork'layın (`Fork`)
2. Yeni bir dal (branch) oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi işleyin (`git commit -m 'Yeni bir özellik eklendi'`)
4. Dalınıza gönderin (`git push origin feature/YeniOzellik`)
5. Bir Çekme İsteği (Pull Request) başlatın.

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.
