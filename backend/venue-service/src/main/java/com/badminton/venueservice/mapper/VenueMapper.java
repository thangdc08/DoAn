package com.badminton.venueservice.mapper;

import com.badminton.venueservice.dto.CourtResponse;
import com.badminton.venueservice.dto.CourtResponse;
import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.entity.Court;
import com.badminton.venueservice.entity.Venue;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VenueMapper {
    @org.mapstruct.Mapping(target = "openTime", dateFormat = "HH:mm:ss")
    @org.mapstruct.Mapping(target = "closeTime", dateFormat = "HH:mm:ss")
    @org.mapstruct.Mapping(target = "images", ignore = true)
    VenueResponse toVenueResponse(Venue venue);
    
    CourtResponse toCourtResponse(Court court);
}
