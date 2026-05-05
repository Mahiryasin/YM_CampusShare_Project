package com.ym_project.rental.Service;

import java.util.List;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.RentalStatus;

public interface IRentalService {

    RentalResponseDTO createRental(RentalRequestDTO request);

    RentalResponseDTO getRentalById(Long id);

    List<RentalResponseDTO> getAllRentals();

    List<RentalResponseDTO> getRentalsByRenter(Long renterUserId);

    List<RentalResponseDTO> getRentalsByOwner(Long ownerUserId);

    List<RentalResponseDTO> getRentalsByItem(Long itemId);

    List<RentalResponseDTO> getRentalsByStatus(RentalStatus status);

    RentalResponseDTO updateRental(Long id, RentalRequestDTO request);

    void deleteRental(Long id);
}
