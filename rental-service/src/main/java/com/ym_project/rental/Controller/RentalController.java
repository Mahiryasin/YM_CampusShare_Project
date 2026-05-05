package com.ym_project.rental.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.RentalStatus;
import com.ym_project.rental.Service.IRentalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final IRentalService rentalService;

    // POST /api/rentals  → yeni kiralama oluştur
    @PostMapping
    public ResponseEntity<RentalResponseDTO> createRental(@Valid @RequestBody RentalRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rentalService.createRental(request));
    }

    // GET /api/rentals              → tümünü listele
    // GET /api/rentals?renterUserId=1   → kiralayan kullanıcıya göre
    // GET /api/rentals?ownerUserId=2    → sahibe göre
    // GET /api/rentals?itemId=5         → item'a göre
    // GET /api/rentals?status=PENDING   → duruma göre
    @GetMapping
    public ResponseEntity<List<RentalResponseDTO>> getRentals(
            @RequestParam(required = false) Long renterUserId,
            @RequestParam(required = false) Long ownerUserId,
            @RequestParam(required = false) Long itemId,
            @RequestParam(required = false) RentalStatus status) {

        List<RentalResponseDTO> rentals;

        if (renterUserId != null) {
            rentals = rentalService.getRentalsByRenter(renterUserId);
        } else if (ownerUserId != null) {
            rentals = rentalService.getRentalsByOwner(ownerUserId);
        } else if (itemId != null) {
            rentals = rentalService.getRentalsByItem(itemId);
        } else if (status != null) {
            rentals = rentalService.getRentalsByStatus(status);
        } else {
            rentals = rentalService.getAllRentals();
        }

        return ResponseEntity.ok(rentals);
    }

    // GET /api/rentals/{id}  → id'ye göre getir
    @GetMapping("/{id}")
    public ResponseEntity<RentalResponseDTO> getRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.getRentalById(id));
    }

    // PUT /api/rentals/{id}  → güncelle
    @PutMapping("/{id}")
    public ResponseEntity<RentalResponseDTO> updateRental(
            @PathVariable Long id,
            @Valid @RequestBody RentalRequestDTO request) {
        return ResponseEntity.ok(rentalService.updateRental(id, request));
    }

    // DELETE /api/rentals/{id}  → sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return ResponseEntity.noContent().build();
    }
}
