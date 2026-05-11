package com.badminton.venueservice.controller;

import com.badminton.venueservice.entity.Venue;
import com.badminton.venueservice.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueRepository venueRepository;

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues(@RequestParam(required = false) String city) {
        if (city != null) {
            return ResponseEntity.ok(venueRepository.findByCity(city));
        }
        return ResponseEntity.ok(venueRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable UUID id) {
        return venueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
