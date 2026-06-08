package com.badminton.bookingservice.mapper;

import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.repository.BookingItemRepository;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class BookingMapper {

    @Autowired
    protected BookingItemRepository bookingItemRepository;

    public BookingResponse toBookingResponse(Booking booking) {
        if (booking == null) {
            return null;
        }
        BookingResponse response = toBookingResponseInternal(booking);
        response.setItems(bookingItemRepository.findByBookingId(booking.getId()));
        return response;
    }

    @org.mapstruct.Mapping(target = "items", ignore = true)
    protected abstract BookingResponse toBookingResponseInternal(Booking booking);
}
