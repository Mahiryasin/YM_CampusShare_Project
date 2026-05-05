package com.ym_project.catalog.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.ym_project.catalog.DTO.ItemRequestDTO;
import com.ym_project.catalog.DTO.ItemResponseDTO;
import com.ym_project.catalog.Entity.Item;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    /**
     * RequestDTO → Entity (yeni kayıt için)
     * BaseEntity alanları (id, createdDate, updatedDate) otomatik ignore edilir
     * çünkü DTO'da bu alanlar yok.
     */
    Item toEntity(ItemRequestDTO request);

    /**
     * Entity → ResponseDTO
     */
    ItemResponseDTO toResponse(Item item);

    /**
     * Güncelleme: mevcut entity'yi DTO verileriyle doldurur,
     * id ve audit alanları dokunulmadan kalır.
     */
    void updateEntityFromRequest(ItemRequestDTO request, @MappingTarget Item item);
}
