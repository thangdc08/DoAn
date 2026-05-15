package com.badminton.bookingservice.mapper;

import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.entity.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    BookingResponse toBookingResponse(Booking booking);
}
