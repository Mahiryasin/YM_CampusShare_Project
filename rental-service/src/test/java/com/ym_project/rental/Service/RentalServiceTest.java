package com.ym_project.rental.Service;

import com.ym_project.rental.DTO.RentalRequestDTO;
import com.ym_project.rental.DTO.RentalResponseDTO;
import com.ym_project.rental.Entity.Rental;
import com.ym_project.rental.Entity.RentalStatus;
import com.ym_project.rental.Repository.IRentalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    @Mock
    private IRentalRepository rentalRepository;

    @Mock
    private com.ym_project.rental.Mapper.RentalMapper rentalMapper;

    @InjectMocks
    private RentalService rentalService;

    private Rental sampleRental;

    @BeforeEach
    void setUp() {
        sampleRental = new Rental();
        sampleRental.setId(1L);
        sampleRental.setItemId(5L);
        sampleRental.setRenterUserId(2L);
        sampleRental.setOwnerUserId(3L);
        sampleRental.setStartDate(LocalDate.now());
        sampleRental.setEndDate(LocalDate.now().plusDays(3));
        sampleRental.setTotalPrice(300.0);
        sampleRental.setStatus(RentalStatus.PENDING);
    }

    @Test
    void createRental_ShouldSaveAndReturnDTO() {
        // Arrange
        RentalRequestDTO request = new RentalRequestDTO();
        request.setItemId(5L);
        request.setRenterUserId(2L);
        request.setOwnerUserId(3L);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(3));
        request.setTotalPrice(300.0);

        when(rentalMapper.toEntity(any(RentalRequestDTO.class))).thenReturn(sampleRental);
        when(rentalRepository.save(any(Rental.class))).thenReturn(sampleRental);
        
        RentalResponseDTO responseDTO = new RentalResponseDTO();
        responseDTO.setStatus(RentalStatus.PENDING);
        responseDTO.setTotalPrice(300.0);
        when(rentalMapper.toResponse(any(Rental.class))).thenReturn(responseDTO);

        // Act
        RentalResponseDTO result = rentalService.createRental(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(RentalStatus.PENDING);
        assertThat(result.getTotalPrice()).isEqualTo(300.0);
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    @Test
    void getRentalById_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(rentalRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> rentalService.getRentalById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Rental bulunamadı, id: 99");
    }

    @Test
    void getRentalsByRenter_ShouldReturnList() {
        // Arrange
        when(rentalRepository.findByRenterUserId(2L)).thenReturn(List.of(sampleRental));
        
        RentalResponseDTO responseDTO = new RentalResponseDTO();
        responseDTO.setRenterUserId(2L);
        when(rentalMapper.toResponse(any(Rental.class))).thenReturn(responseDTO);

        // Act
        List<RentalResponseDTO> result = rentalService.getRentalsByRenter(2L);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRenterUserId()).isEqualTo(2L);
    }
}
