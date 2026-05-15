package com.badminton.venueservice.service;

import com.badminton.common.exception.AppException;
import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.entity.Court;
import com.badminton.venueservice.entity.PriceRule;
import com.badminton.venueservice.entity.Venue;
import com.badminton.venueservice.mapper.VenueMapper;
import com.badminton.venueservice.repository.CourtRepository;
import com.badminton.venueservice.repository.PriceRuleRepository;
import com.badminton.venueservice.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.badminton.venueservice.dto.OnboardVenueRequest;
import com.badminton.venueservice.dto.FlexiblePriceDTO;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueService {

    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;
    private final PriceRuleRepository priceRuleRepository;
    private final VenueMapper venueMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public List<VenueResponse> findAll() {
        log.info("Fetching all venues");
        return venueRepository.findAll().stream()
                .map(venueMapper::toVenueResponse)
                .collect(Collectors.toList());
    }

    public VenueResponse findVenueResponseById(UUID id) {
        log.info("Fetching venue response by id: {}", id);
        return venueMapper.toVenueResponse(findById(id));
    }

    public Venue findById(UUID id) {
        return venueRepository.findById(id).orElseThrow(() -> 
                new AppException(HttpStatus.NOT_FOUND, "Venue not found"));
    }

    @Transactional
    public VenueResponse createVenue(Venue venue) {
        log.info("Creating new venue: {}", venue.getName());
        Venue savedVenue = venueRepository.save(venue);
        return venueMapper.toVenueResponse(savedVenue);
    }

    @Transactional
    public VenueResponse onboardVenue(UUID ownerId, OnboardVenueRequest request) {
        log.info("Onboarding new venue for owner {}: {}", ownerId, request.getVenueName());

        Point location = null;
        if (request.getLatitude() != null && request.getLongitude() != null) {
            // Note: JTS Point uses (x, y) which is (longitude, latitude)
            location = geometryFactory.createPoint(new Coordinate(request.getLongitude(), request.getLatitude()));
        }

        // 1. Create Venue
        Venue venue = Venue.builder()
                .ownerId(ownerId)
                .name(request.getVenueName())
                .address(request.getAddress())
                .city(request.getCity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .location(location)
                .utilities(request.getUtilities())
                .openTime(request.getOpenTime())
                .closeTime(request.getCloseTime())
                .status("PENDING_APPROVAL")
                .build();
        
        Venue savedVenue = venueRepository.save(venue);

        // 2. Create Courts
        List<Court> courts = new ArrayList<>();
        for (int i = 1; i <= request.getCourtCount(); i++) {
            Court court = Court.builder()
                    .venue(savedVenue)
                    .name("Sân " + i)
                    .courtType("STANDARD")
                    .status("ACTIVE")
                    .build();
            courts.add(courtRepository.save(court));
        }

        // 3. Create PriceRules (apply to all days 1-7, and all courts... or just tied to venue)
        // Since PriceRule has courtId, we might tie it to venueId and leave courtId null, 
        // or create for each court. The entity allows null courtId to mean "all courts in venue".
        if (request.getPricing() != null && !request.getPricing().isEmpty()) {
            for (FlexiblePriceDTO pricing : request.getPricing()) {
                for (int day = 1; day <= 7; day++) {
                    PriceRule rule = PriceRule.builder()
                            .venueId(savedVenue.getId())
                            .courtId(null) // Applies to all courts
                            .dayOfWeek(day)
                            .startTime(pricing.getFrom())
                            .endTime(pricing.getTo())
                            .pricePerHour(pricing.getPrice())
                            .status("ACTIVE")
                            .build();
                    priceRuleRepository.save(rule);
                }
            }
        }

        return venueMapper.toVenueResponse(savedVenue);
    }

    @Transactional
    public Court createCourt(UUID venueId, Court court) {
        log.info("Creating court {} for venue {}", court.getName(), venueId);
        Venue venue = findById(venueId);
        court.setVenue(venue);
        return courtRepository.save(court);
    }

    public List<Court> findCourtsByVenueId(UUID venueId) {
        log.info("Fetching courts for venue {}", venueId);
        return courtRepository.findByVenueId(venueId);
    }

    public BigDecimal calculatePrice(UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        log.info("Calculating price for court {} from {} to {}", courtId, startTime, endTime);
        Court court = courtRepository.findById(courtId).orElseThrow(() -> 
                new AppException(HttpStatus.NOT_FOUND, "Court not found"));
        
        return getPriceFromRules(court, startTime);
    }

    private BigDecimal getPriceFromRules(Court court, LocalDateTime startTime) {
        int dayOfWeek = startTime.getDayOfWeek().getValue();
        LocalTime start = startTime.toLocalTime();

        List<PriceRule> rules = priceRuleRepository.findByVenueIdAndDayOfWeek(court.getVenue().getId(), dayOfWeek);
        
        return rules.stream()
                .filter(r -> !start.isBefore(r.getStartTime()) && !start.isAfter(r.getEndTime()))
                .findFirst()
                .map(PriceRule::getPricePerHour)
                .orElse(BigDecimal.valueOf(100000));
    }
}
