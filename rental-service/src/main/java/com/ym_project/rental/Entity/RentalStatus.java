package com.ym_project.rental.Entity;

public enum RentalStatus {
    PENDING,    // Onay bekliyor
    APPROVED,   // Onaylandı
    REJECTED,   // Reddedildi
    ACTIVE,     // Devam ediyor
    COMPLETED,  // Tamamlandı
    CANCELLED   // İptal edildi
}
