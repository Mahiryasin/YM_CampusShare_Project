package com.ym_project.rental.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ym_project.rental.Entity.Rental;
import com.ym_project.rental.Entity.RentalStatus;

@Repository
public interface IRentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByRenterUserId(Long renterUserId);

    List<Rental> findByOwnerUserId(Long ownerUserId);

    List<Rental> findByItemId(Long itemId);

    List<Rental> findByStatus(RentalStatus status);
}
