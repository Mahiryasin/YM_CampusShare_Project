package com.ym_project.rental.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.Rental;

import org.mapstruct.factory.Mappers;

@Mapper
public interface RentalMapper {

    RentalMapper INSTANCE = Mappers.getMapper(RentalMapper.class);


    Rental toEntity(RentalRequestDTO request);

    RentalResponseDTO toResponse(Rental rental);

    void updateEntityFromRequest(RentalRequestDTO request, @MappingTarget Rental rental);
}
