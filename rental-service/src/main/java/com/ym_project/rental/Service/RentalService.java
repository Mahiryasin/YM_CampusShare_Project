package com.ym_project.rental.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.Rental;
import com.ym_project.rental.Entity.RentalStatus;
import com.ym_project.rental.Mapper.RentalMapper;
import com.ym_project.rental.Repository.IRentalRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RentalService implements IRentalService {

    private final IRentalRepository rentalRepository;
    private final RentalMapper rentalMapper;

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Override
    public RentalResponseDTO createRental(RentalRequestDTO request) {
        Rental rental = rentalMapper.toEntity(request);
        if (rental.getStatus() == null) {
            rental.setStatus(RentalStatus.PENDING);
        }
        return rentalMapper.toResponse(rentalRepository.save(rental));
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    @Override
    public RentalResponseDTO getRentalById(Long id) {
        return rentalMapper.toResponse(findOrThrow(id));
    }

    @Override
    public List<RentalResponseDTO> getAllRentals() {
        return rentalRepository.findAll().stream()
                .map(rentalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RentalResponseDTO> getRentalsByRenter(Long renterUserId) {
        return rentalRepository.findByRenterUserId(renterUserId).stream()
                .map(rentalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RentalResponseDTO> getRentalsByOwner(Long ownerUserId) {
        return rentalRepository.findByOwnerUserId(ownerUserId).stream()
                .map(rentalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RentalResponseDTO> getRentalsByItem(Long itemId) {
        return rentalRepository.findByItemId(itemId).stream()
                .map((item)->rentalMapper.toResponse(item))
                .collect(Collectors.toList());
    }

    @Override
    public List<RentalResponseDTO> getRentalsByStatus(RentalStatus status) {
        return rentalRepository.findByStatus(status).stream()
                .map(rentalMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @Override
    public RentalResponseDTO updateRental(Long id, RentalRequestDTO request) {
        Rental rental = findOrThrow(id);
        rentalMapper.updateEntityFromRequest(request, rental);
        return rentalMapper.toResponse(rentalRepository.save(rental));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Override
    public void deleteRental(Long id) {
        rentalRepository.delete(findOrThrow(id));
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────

    private Rental findOrThrow(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rental bulunamadı, id: " + id));
    }
}
