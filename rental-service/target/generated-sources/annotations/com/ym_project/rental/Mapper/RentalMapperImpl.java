package com.ym_project.rental.Mapper;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.Rental;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-05T14:03:02+0300",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class RentalMapperImpl implements RentalMapper {

    @Override
    public Rental toEntity(RentalRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Rental rental = new Rental();

        rental.setEndDate( request.getEndDate() );
        rental.setItemId( request.getItemId() );
        rental.setOwnerUserId( request.getOwnerUserId() );
        rental.setRenterUserId( request.getRenterUserId() );
        rental.setStartDate( request.getStartDate() );
        rental.setStatus( request.getStatus() );
        rental.setTotalPrice( request.getTotalPrice() );

        return rental;
    }

    @Override
    public RentalResponseDTO toResponse(Rental rental) {
        if ( rental == null ) {
            return null;
        }

        RentalResponseDTO rentalResponseDTO = new RentalResponseDTO();

        rentalResponseDTO.setCreatedDate( rental.getCreatedDate() );
        rentalResponseDTO.setEndDate( rental.getEndDate() );
        rentalResponseDTO.setId( rental.getId() );
        rentalResponseDTO.setItemId( rental.getItemId() );
        rentalResponseDTO.setOwnerUserId( rental.getOwnerUserId() );
        rentalResponseDTO.setRenterUserId( rental.getRenterUserId() );
        rentalResponseDTO.setStartDate( rental.getStartDate() );
        rentalResponseDTO.setStatus( rental.getStatus() );
        rentalResponseDTO.setTotalPrice( rental.getTotalPrice() );
        rentalResponseDTO.setUpdatedDate( rental.getUpdatedDate() );

        return rentalResponseDTO;
    }

    @Override
    public void updateEntityFromRequest(RentalRequestDTO request, Rental rental) {
        if ( request == null ) {
            return;
        }

        rental.setEndDate( request.getEndDate() );
        rental.setItemId( request.getItemId() );
        rental.setOwnerUserId( request.getOwnerUserId() );
        rental.setRenterUserId( request.getRenterUserId() );
        rental.setStartDate( request.getStartDate() );
        rental.setStatus( request.getStatus() );
        rental.setTotalPrice( request.getTotalPrice() );
    }
}
