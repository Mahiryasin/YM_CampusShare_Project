package com.ym_project.catalog.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ym_project.catalog.DTO.ItemRequestDTO;
import com.ym_project.catalog.DTO.ItemResponseDTO;
import com.ym_project.catalog.ExceptionHandler.ApiError;
import com.ym_project.catalog.Service.ICatalogService;

import feign.FeignException;
import feign.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final ICatalogService catalogService;
    private final com.ym_project.catalog.Proxy.OpenFeign openFeign;

    // POST /api/catalog/items  → yeni item ekle
    @PostMapping("/items")
    public ResponseEntity<?> createItem(@Valid @RequestBody ItemRequestDTO request) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper=new ObjectMapper();
        try {
            openFeign.GetuserProfile(request.getOwnerUserId());
            ItemResponseDTO response = catalogService.createItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (FeignException exception) {
            // User Service'den gelen hata mesajını  olduğu gibi döndür
          ApiError<?> apiError=objectMapper.readValue(exception.contentUTF8(),ApiError.class);
            return ResponseEntity.status(exception.status()).body(apiError);
        }
    }

    // GET /api/catalog/items       → tüm itemları listele (sayfalama destekli)
    // GET /api/catalog/items?category=Kitap   → kategoriye göre filtrele
    // GET /api/catalog/items?ownerUserId=3    → sahibine göre filtrele
    // GET /api/catalog/items?page=0&size=10  → sayfa numarası ve boyutu
    @GetMapping("/items")
    public ResponseEntity<Map<String, Object>> getItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long ownerUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<ItemResponseDTO> allItems;

        if (category != null) {
            allItems = catalogService.getItemsByCategory(category);
        } else if (ownerUserId != null) {
            allItems = catalogService.getItemsByOwner(ownerUserId);
        } else {
            allItems = catalogService.getAllItems();
        }

        // Manuel sayfalama
        int totalElements = allItems.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<ItemResponseDTO> pagedItems = allItems.subList(fromIndex, toIndex);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", pagedItems);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);
        response.put("currentPage", page);
        response.put("pageSize", size);

        return ResponseEntity.ok(response);
    }

    // GET /api/catalog/items/{id}  → id'ye göre item getir
    @GetMapping("/items/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id) {
        ItemResponseDTO response = catalogService.getItemById(id);
        return ResponseEntity.ok(response);
    }

    // PUT /api/catalog/items/{id}  → item güncelle
    @PutMapping("/items/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequestDTO request) {
        ItemResponseDTO response = catalogService.updateItem(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/catalog/items/{id}  → item sil
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        catalogService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
