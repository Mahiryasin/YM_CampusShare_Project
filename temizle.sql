-- ============================================================
-- CAMPUSSHARE SAFE DATA CLEANUP SCRIPT (Tablo Yapılarını Korumak İçin)
-- ============================================================

-- 1. Değerlendirmeler Veritabanı
USE CampusShare_ReviewDB;
PRINT 'CampusShare_ReviewDB.dbo.reviews tablosu temizleniyor...';
DELETE FROM dbo.reviews;
DBCC CHECKIDENT ('dbo.reviews', RESEED, 0);

-- 2. Kiralama Veritabanı
USE CampusShare_RentalDB;
PRINT 'CampusShare_RentalDB.dbo.rentals tablosu temizleniyor...';
DELETE FROM dbo.rentals;
DBCC CHECKIDENT ('dbo.rentals', RESEED, 0);

-- 3. Katalog Veritabanı
USE CampusShare_CatalogDB;
PRINT 'CampusShare_CatalogDB.dbo.items tablosu temizleniyor...';
DELETE FROM dbo.items;
DBCC CHECKIDENT ('dbo.items', RESEED, 0);

-- 4. Kullanıcı Veritabanı
USE CampusShare_UserDB;
PRINT 'CampusShare_UserDB.dbo.user_credentials tablosu temizleniyor...';
DELETE FROM dbo.user_credentials;
DBCC CHECKIDENT ('dbo.user_credentials', RESEED, 0);

PRINT 'CampusShare_UserDB.dbo.user_profile tablosu temizleniyor...';
DELETE FROM dbo.user_profile;
DBCC CHECKIDENT ('dbo.user_profile', RESEED, 0);

PRINT '============================================================';
PRINT ' TEMİZLEME İŞLEMİ TAMAMLANDI! VERİTABANI ŞEMALARI KORUNDU!';
PRINT '============================================================';
