package com.badminton.venueservice.mapper;

import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.entity.Venue;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VenueMapper {
    VenueResponse toVenueResponse(Venue venue);
}
