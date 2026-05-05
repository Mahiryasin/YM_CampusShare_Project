package com.ym_project.catalog.Service;

import java.util.List;

import com.ym_project.catalog.DTO.ItemRequestDTO;
import com.ym_project.catalog.DTO.ItemResponseDTO;

public interface ICatalogService {

    ItemResponseDTO createItem(ItemRequestDTO request);

    ItemResponseDTO getItemById(Long id);

    List<ItemResponseDTO> getAllItems();

    List<ItemResponseDTO> getItemsByCategory(String category);

    List<ItemResponseDTO> getItemsByOwner(Long ownerUserId);

    ItemResponseDTO updateItem(Long id, ItemRequestDTO request);

    void deleteItem(Long id);
}
