package com.ym_project.catalog.Mapper;

import com.ym_project.catalog.DTO.ItemRequestDTO;
import com.ym_project.catalog.DTO.ItemResponseDTO;
import com.ym_project.catalog.Entity.Item;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-05T14:02:36+0300",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ItemMapperImpl implements ItemMapper {

    @Override
    public Item toEntity(ItemRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Item item = new Item();

        item.setCategory( request.getCategory() );
        item.setCondition( request.getCondition() );
        item.setDailyPrice( request.getDailyPrice() );
        item.setDescription( request.getDescription() );
        item.setIsAvailable( request.getIsAvailable() );
        item.setOwnerUserId( request.getOwnerUserId() );
        item.setTitle( request.getTitle() );

        return item;
    }

    @Override
    public ItemResponseDTO toResponse(Item item) {
        if ( item == null ) {
            return null;
        }

        ItemResponseDTO itemResponseDTO = new ItemResponseDTO();

        itemResponseDTO.setCategory( item.getCategory() );
        itemResponseDTO.setCondition( item.getCondition() );
        itemResponseDTO.setCreatedDate( item.getCreatedDate() );
        itemResponseDTO.setDailyPrice( item.getDailyPrice() );
        itemResponseDTO.setDescription( item.getDescription() );
        itemResponseDTO.setId( item.getId() );
        itemResponseDTO.setIsAvailable( item.getIsAvailable() );
        itemResponseDTO.setOwnerUserId( item.getOwnerUserId() );
        itemResponseDTO.setTitle( item.getTitle() );
        itemResponseDTO.setUpdatedDate( item.getUpdatedDate() );

        return itemResponseDTO;
    }

    @Override
    public void updateEntityFromRequest(ItemRequestDTO request, Item item) {
        if ( request == null ) {
            return;
        }

        item.setCategory( request.getCategory() );
        item.setCondition( request.getCondition() );
        item.setDailyPrice( request.getDailyPrice() );
        item.setDescription( request.getDescription() );
        item.setIsAvailable( request.getIsAvailable() );
        item.setOwnerUserId( request.getOwnerUserId() );
        item.setTitle( request.getTitle() );
    }
}
