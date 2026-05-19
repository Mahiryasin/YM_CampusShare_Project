package com.ym_project.catalog.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ym_project.catalog.DTO.ItemRequestDTO;
import com.ym_project.catalog.DTO.ItemResponseDTO;
import com.ym_project.catalog.Entity.Item;
import com.ym_project.catalog.Mapper.ItemMapper;
import com.ym_project.catalog.Repository.IItemRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatalogService implements ICatalogService {

    private final IItemRepository itemRepository;
    private final ItemMapper itemMapper = ItemMapper.INSTANCE;

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Override
    public ItemResponseDTO createItem(ItemRequestDTO request) {
        Item item = itemMapper.toEntity(request);
        Item savedItem = itemRepository.save(item);
        return itemMapper.toResponse(savedItem);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    @Override
    public ItemResponseDTO getItemById(Long id) {
        Item item = findItemOrThrow(id);
        return itemMapper.toResponse(item);
    }

    @Override
    public List<ItemResponseDTO> getAllItems() {
        return itemRepository.findAll()
                .stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponseDTO> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category)
                .stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponseDTO> getItemsByOwner(Long ownerUserId) {
        return itemRepository.findByOwnerUserId(ownerUserId)
                .stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @Override
    public ItemResponseDTO updateItem(Long id, ItemRequestDTO request) {
        Item item = findItemOrThrow(id);
        itemMapper.updateEntityFromRequest(request, item);
        Item updatedItem = itemRepository.save(item);
        return itemMapper.toResponse(updatedItem);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Override
    public void deleteItem(Long id) {
        Item item = findItemOrThrow(id);
        itemRepository.delete(item);
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────

    private Item findItemOrThrow(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item bulunamadı, id: " + id));
    }
}
