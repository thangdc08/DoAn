package com.badminton.venueservice.service;

import com.badminton.common.exception.AppException;
import com.badminton.common.constant.VenueStatus;
import com.badminton.venueservice.dto.CourtResponse;
import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.entity.Court;
import com.badminton.venueservice.entity.PriceRule;
import com.badminton.venueservice.entity.Venue;
import com.badminton.venueservice.mapper.VenueMapper;
import com.badminton.venueservice.entity.VenueImage;
import com.badminton.venueservice.repository.CourtRepository;
import com.badminton.venueservice.repository.PriceRuleRepository;
import com.badminton.venueservice.repository.VenueImageRepository;
import com.badminton.venueservice.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.badminton.venueservice.dto.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import com.cloudinary.utils.ObjectUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueService {

    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;
    private final PriceRuleRepository priceRuleRepository;
    private final VenueImageRepository venueImageRepository;
    private final VenueMapper venueMapper;
    private final com.cloudinary.Cloudinary cloudinary;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-") + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    public List<VenueResponse> findAll() {
        log.info("Fetching all venues");
        return venueRepository.findAll().stream()
                .map(this::toVenueResponse)
                .collect(Collectors.toList());
    }

    public List<VenueResponse> findVenuesByOwnerId(UUID ownerId) {
        log.info("Fetching venues for owner: {}", ownerId);
        return venueRepository.findByOwnerId(ownerId).stream()
                .map(this::toVenueResponse)
                .collect(Collectors.toList());
    }

    public VenueResponse findVenueResponseById(UUID id) {
        log.info("Fetching venue response by id: {}", id);
        return toVenueResponse(findById(id));
    }

    public Venue findById(UUID id) {
        return venueRepository.findById(id).orElseThrow(() -> 
                new AppException(HttpStatus.NOT_FOUND, "Venue not found"));
    }

    @Transactional
    public VenueResponse createVenue(UUID ownerId, CreateVenueRequest request) {
        log.info("Creating new venue for owner {}: {}", ownerId, request.getName());

        Point location = null;
        if (request.getLatitude() != null && request.getLongitude() != null) {
            location = geometryFactory.createPoint(new Coordinate(request.getLongitude(), request.getLatitude()));
        }

        Venue venue = Venue.builder()
                .ownerId(ownerId)
                .name(request.getName())
                .slug(generateSlug(request.getName()))
                .description(request.getDescription())
                .address(request.getAddress())
                .ward(request.getWard())
                .city(request.getCity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .location(location)
                .phone(request.getPhone())
                .email(request.getEmail())
                .utilities(request.getUtilities())
                .openTime(request.getOpenTime() != null ? LocalTime.parse(request.getOpenTime()) : null)
                .closeTime(request.getCloseTime() != null ? LocalTime.parse(request.getCloseTime()) : null)
                .policy(request.getPolicy())
                .courtCount(request.getCourtCount() != null ? request.getCourtCount() : 0)
                .status(VenueStatus.PENDING_APPROVAL)
                .build();

        Venue savedVenue = venueRepository.save(venue);

        // Create courts if courtCount is provided
        if (request.getCourtCount() != null && request.getCourtCount() > 0) {
            for (int i = 1; i <= request.getCourtCount(); i++) {
                Court court = Court.builder()
                        .venue(savedVenue)
                        .name("Sân " + i)
                        .courtType("STANDARD")
                        .status("ACTIVE")
                        .build();
                courtRepository.save(court);
            }
        }

        return toVenueResponse(savedVenue);
    }



    @Transactional
    public VenueResponse updateVenue(UUID venueId, UpdateVenueRequest request) {
        log.info("Updating venue: {}", venueId);
        Venue venue = findById(venueId);

        if (request.getName() != null) venue.setName(request.getName());
        if (request.getDescription() != null) venue.setDescription(request.getDescription());
        if (request.getAddress() != null) venue.setAddress(request.getAddress());
        if (request.getWard() != null) venue.setWard(request.getWard());
        if (request.getCity() != null) venue.setCity(request.getCity());
        if (request.getPhone() != null) venue.setPhone(request.getPhone());
        if (request.getEmail() != null) venue.setEmail(request.getEmail());
        if (request.getUtilities() != null) venue.setUtilities(request.getUtilities());
        if (request.getPolicy() != null) venue.setPolicy(request.getPolicy());
        
        if (request.getOpenTime() != null) venue.setOpenTime(LocalTime.parse(request.getOpenTime()));
        if (request.getCloseTime() != null) venue.setCloseTime(LocalTime.parse(request.getCloseTime()));

        if (request.getLatitude() != null) venue.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) venue.setLongitude(request.getLongitude());
        
        if (request.getLatitude() != null && request.getLongitude() != null) {
            Point location = geometryFactory.createPoint(new Coordinate(request.getLongitude(), request.getLatitude()));
            venue.setLocation(location);
        }

        if (request.getStatus() != null) {
            venue.setStatus(VenueStatus.valueOf(request.getStatus()));
        }
        
        if (request.getCourtCount() != null) {
            venue.setCourtCount(request.getCourtCount());
        }

        Venue savedVenue = venueRepository.save(venue);

                if (request.getCourtCount() != null) {
            List<Court> currentCourts = courtRepository.findByVenueIdOrderByDisplayOrderAsc(venueId);
            int currentCount = currentCourts.size();
            
            if (request.getCourtCount() > currentCount) {
                // Add new courts
                for (int i = currentCount + 1; i <= request.getCourtCount(); i++) {
                    Court court = Court.builder()
                            .venue(savedVenue)
                            .name("Sân " + i)
                            .courtType("STANDARD")
                            .status("ACTIVE")
                            .build();
                    courtRepository.save(court);
                }
            } else if (request.getCourtCount() < currentCount) {
                // Delete excess courts (the ones with higher numbers)
                currentCourts.sort((a, b) -> b.getName().compareTo(a.getName()));
                int toDelete = currentCount - request.getCourtCount();
                for (int i = 0; i < toDelete; i++) {
                    courtRepository.delete(currentCourts.get(i));
                }
            }
        }

        return toVenueResponse(savedVenue);
    }

    @Transactional
    public void deleteVenue(UUID venueId) {
        log.info("Deleting venue: {0}", venueId);
        Venue venue = findById(venueId);
        venueImageRepository.deleteByVenueId(venueId);
        courtRepository.deleteByVenueId(venueId);
        venueRepository.delete(venue);
    }


    private VenueResponse toVenueResponse(Venue venue) {
        VenueResponse response = venueMapper.toVenueResponse(venue);
        
        // Map images
        List<VenueImage> images = venueImageRepository.findByVenueId(venue.getId());
        response.setImages(images.stream()
                .map(img -> VenueImageResponse.builder()
                        .id(img.getId())
                        .venueId(img.getVenueId())
                        .imageUrl(img.getImageUrl())
                        .displayOrder(img.getDisplayOrder())
                        .createdAt(img.getCreatedAt())
                        .build())
                .collect(Collectors.toList()));
        
        // Map courtCount
        log.info("Mapping venue response for {}. courtCount in entity: {}", venue.getId(), venue.getCourtCount());
        response.setCourtCount(venue.getCourtCount());
        log.info("Response courtCount set to: {}", response.getCourtCount());
        
        return response;
    }

    @Transactional
    public void uploadVenueImages(UUID venueId, List<org.springframework.web.multipart.MultipartFile> files) {
        log.info("Uploading {} images for venue {}", files.size(), venueId);
        Venue venue = findById(venueId);
        for (org.springframework.web.multipart.MultipartFile file : files) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = uploadResult.get("url").toString();
                
                VenueImage venueImage = VenueImage.builder()
                        .venueId(venueId)
                        .imageUrl(imageUrl)
                        .build();
                
                venueImageRepository.save(venueImage);
            } catch (java.io.IOException e) {
                log.error("Failed to upload image to Cloudinary", e);
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải ảnh lên Cloudinary");
            }
        }
    }

    @Transactional
    public void deleteVenueImage(UUID venueId, UUID imageId) {
        log.info("Deleting image {} from venue {}", imageId, venueId);
        VenueImage image = venueImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Kh�ng t�m th?y ?nh"));
        
        if (!image.getVenueId().equals(venueId)) {
            throw new RuntimeException("?nh kh�ng thu?c v? co s? n�y");
        }
        
        venueImageRepository.delete(image);
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
                .ward(request.getWard())
                .city(request.getCity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .location(location)
                .phone(request.getPhone())
                .email(request.getEmail())
                .utilities(request.getUtilities())
                .openTime(request.getOpenTime())
                .closeTime(request.getCloseTime())
                .status(VenueStatus.PENDING_APPROVAL)
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

        return toVenueResponse(savedVenue);
    }



    @Transactional
    public Court createCourt(UUID venueId, Court court) {
        log.info("Creating court {} for venue {}", court.getName(), venueId);
        Venue venue = findById(venueId);
        court.setVenue(venue);
        return courtRepository.save(court);
    }

    public List<CourtResponse> findCourtsByVenueId(UUID venueId) {
        log.info("Fetching courts for venue {}", venueId);
        List<Court> courts = courtRepository.findByVenueIdOrderByDisplayOrderAsc(venueId);
        log.info("Found {} courts. Order: {}", courts.size(), 
                courts.stream().map(c -> c.getName() + "(Order:" + c.getDisplayOrder() + ")").collect(Collectors.joining(", ")));
        return courts.stream()
                .map(venueMapper::toCourtResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void reorderCourts(UUID venueId, List<UUID> courtIds) {
        log.info("Reordering courts for venue: {}. New order: {}", venueId, courtIds);
        for (int i = 0; i < courtIds.size(); i++) {
            UUID courtId = courtIds.get(i);
            Court court = courtRepository.findById(courtId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân " + courtId));
            
            if (!court.getVenue().getId().equals(venueId)) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Sân " + courtId + " không thuộc về cơ sở này");
            }
            
            log.info("Setting displayOrder for court {} ({}) to {}", court.getName(), courtId, i);
            court.setDisplayOrder(i);
            courtRepository.save(court);
        }
        log.info("Reordering completed for venue {}", venueId);
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





