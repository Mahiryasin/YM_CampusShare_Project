package com.ym_project.rental.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.Rental;

@Mapper(componentModel = "spring")
public interface RentalMapper {

    Rental toEntity(RentalRequestDTO request);

    RentalResponseDTO toResponse(Rental rental);

    void updateEntityFromRequest(RentalRequestDTO request, @MappingTarget Rental rental);
}
