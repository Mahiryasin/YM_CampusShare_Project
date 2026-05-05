package com.ym_project.catalog.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ym_project.catalog.Entity.Item;

@Repository
public interface IItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByCategory(String category);

    List<Item> findByOwnerUserId(Long ownerUserId);

    List<Item> findByIsAvailableTrue();
}
