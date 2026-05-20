package com.badminton.bookingservice.config;

import com.badminton.bookingservice.mapper.BookingMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public BookingMapper bookingMapper() {
        return Mappers.getMapper(BookingMapper.class);
    }
}
