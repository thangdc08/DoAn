package com.badminton.venueservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.badminton")
public class VenueApplication {
    public static void main(String[] args) {
        SpringApplication.run(VenueApplication.class, args);
    }
}
