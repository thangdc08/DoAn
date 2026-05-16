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
import com.badminton.venueservice.dto.*;
import com.badminton.venueservice.entity.CourtSlot;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.badminton.venueservice.repository.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueService {

    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;
    private final PriceRuleRepository priceRuleRepository;
    private final VenueImageRepository venueImageRepository;
    private final CourtSlotRepository courtSlotRepository;
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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh"));
        
        if (!image.getVenueId().equals(venueId)) {
            throw new RuntimeException("Ảnh không thuộc về cơ sở này");
        }           
        
        venueImageRepository.delete(image);
    }

    @Transactional
    public VenueResponse onboardVenue(UUID ownerId, OnboardVenueRequest request) {
        log.info("Onboarding new venue for owner {}: {}", ownerId, request.getVenueName());

        Point location = null;
        if (request.getLatitude() != null && request.getLongitude() != null) {
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
                .courtCount(request.getCourtCount()) // Set courtCount here
                .status(VenueStatus.PENDING_APPROVAL)
                .build();
        
        Venue savedVenue = venueRepository.save(venue);

        // 2. Create Courts and initial Slots for 30 days
        int startHour = savedVenue.getOpenTime() != null ? savedVenue.getOpenTime().getHour() : 5;
        int endHour = savedVenue.getCloseTime() != null ? savedVenue.getCloseTime().getHour() : 22;
        if (endHour == 0) endHour = 24;

        for (int i = 1; i <= request.getCourtCount(); i++) {
            Court court = Court.builder()
                    .venue(savedVenue)
                    .name("Sân " + i)
                    .courtType("STANDARD")
                    .status("ACTIVE")
                    .displayOrder(i-1)
                    .build();
            Court savedCourt = courtRepository.save(court);

            // Generate slots for next 30 days
            List<CourtSlot> initialSlots = new ArrayList<>();
            LocalDate today = LocalDate.now();
            for (int day = 0; day < 30; day++) {
                LocalDate slotDate = today.plusDays(day);
                for (int h = startHour; h < endHour; h++) {
                    // Slot 1: h:00 - h:30
                    initialSlots.add(CourtSlot.builder()
                            .court(savedCourt)
                            .slotDate(slotDate)
                            .startTime(LocalTime.of(h, 0))
                            .endTime(LocalTime.of(h, 30))
                            .status("AVAILABLE")
                            .build());
                    // Slot 2: h:30 - (h+1):00
                    initialSlots.add(CourtSlot.builder()
                            .court(savedCourt)
                            .slotDate(slotDate)
                            .startTime(LocalTime.of(h, 30))
                            .endTime(LocalTime.of(h + 1 == 24 ? 23 : h + 1, h + 1 == 24 ? 59 : 0))
                            .status("AVAILABLE")
                            .build());
                }
            }
            courtSlotRepository.saveAll(initialSlots);
        }

        // 3. Create PriceRules
        if (request.getPricing() != null && !request.getPricing().isEmpty()) {
            for (FlexiblePriceDTO pricing : request.getPricing()) {
                for (int day = 1; day <= 7; day++) {
                    PriceRule rule = PriceRule.builder()
                            .venueId(savedVenue.getId())
                            .courtId(null)
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
    public CourtResponse createCourt(UUID venueId, CreateCourtRequest request) {
        log.info("Creating court {} for venue {}", request.getName(), venueId);
        Venue venue = findById(venueId);
        
        // Increment courtCount
        venue.setCourtCount((venue.getCourtCount() != null ? venue.getCourtCount() : 0) + 1);
        venueRepository.save(venue);
        
        Court court = Court.builder()
                .venue(venue)
                .name(request.getName())
                .courtType(request.getCourtType())
                .description(request.getDescription())
                .status("ACTIVE")
                .displayOrder(venue.getCourtCount() - 1)
                .build();
        
        Court savedCourt = courtRepository.save(court);

        // Generate slots for next 30 days
        int startHour = venue.getOpenTime() != null ? venue.getOpenTime().getHour() : 5;
        int endHour = venue.getCloseTime() != null ? venue.getCloseTime().getHour() : 22;
        if (endHour == 0) endHour = 24;

        List<CourtSlot> initialSlots = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int day = 0; day < 30; day++) {
            LocalDate slotDate = today.plusDays(day);
            for (int h = startHour; h < endHour; h++) {
                // Slot 1: h:00 - h:30
                initialSlots.add(CourtSlot.builder()
                        .court(savedCourt)
                        .slotDate(slotDate)
                        .startTime(LocalTime.of(h, 0))
                        .endTime(LocalTime.of(h, 30))
                        .status("AVAILABLE")
                        .build());
                // Slot 2: h:30 - (h+1):00
                initialSlots.add(CourtSlot.builder()
                        .court(savedCourt)
                        .slotDate(slotDate)
                        .startTime(LocalTime.of(h, 30))
                        .endTime(LocalTime.of(h + 1 == 24 ? 23 : h + 1, h + 1 == 24 ? 59 : 0))
                        .status("AVAILABLE")
                        .build());
            }
        }
        courtSlotRepository.saveAll(initialSlots);

        return venueMapper.toCourtResponse(savedCourt);
    }

    @Transactional
    public void deleteCourt(UUID venueId, UUID courtId) {
        log.info("Deleting court {} from venue {}", courtId, venueId);
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân lẻ"));

        if (!court.getVenue().getId().equals(venueId)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Sân lẻ không thuộc về cơ sở này");
        }

        try {
            Venue venue = court.getVenue();
            
            // 1. Tự động xóa các bảng giá gắn liền với sân này
            log.info("Deleting associated price rules for court {}", courtId);
            priceRuleRepository.deleteByCourtId(courtId);

            // 2. Cập nhật số lượng sân của Venue
            int currentCount = venue.getCourtCount() != null ? venue.getCourtCount() : 0;
            venue.setCourtCount(Math.max(0, currentCount - 1));
            venueRepository.save(venue);

            // 3. Xóa sân lẻ
            courtRepository.delete(court);
            courtRepository.flush(); 
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.error("Failed to delete court {} due to integrity violation (likely existing bookings)", courtId, e);
            throw new AppException(HttpStatus.CONFLICT, 
                "Không thể xóa sân này vì hiện đang có lịch khách đặt. Vui lòng kiểm tra và xử lý các lịch đặt trước khi xóa.");
        } catch (Exception e) {
            log.error("Unexpected error deleting court {}", courtId, e);
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Có lỗi xảy ra khi xóa sân. Vui lòng thử lại sau.");
        }
    }

    public List<CourtSlotResponse> getCourtAvailability(UUID venueId, UUID courtId, LocalDate date) {
        log.info("Fetching availability for court {} on {}", courtId, date);
        
        List<CourtSlot> slots = courtSlotRepository.findByCourtIdAndSlotDate(courtId, date);
        
        if (!slots.isEmpty()) {
            return slots.stream()
                    .map(s -> CourtSlotResponse.builder()
                            .startTime(s.getStartTime().toString())
                            .endTime(s.getEndTime().toString())
                            .status(s.getStatus())
                            .build())
                    .collect(Collectors.toList());
        }

        // Fallback to default venue hours if no specific slots configured
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân lẻ"));
        Venue venue = court.getVenue();
        
        int startHour = venue.getOpenTime() != null ? venue.getOpenTime().getHour() : 5;
        int endHour = venue.getCloseTime() != null ? venue.getCloseTime().getHour() : 22;
        if (endHour == 0) endHour = 24;

        List<CourtSlotResponse> defaultSlots = new ArrayList<>();
        for (int h = startHour; h < endHour; h++) {
            // Slot 1: h:00 - h:30
            defaultSlots.add(CourtSlotResponse.builder()
                    .startTime(LocalTime.of(h, 0).toString())
                    .endTime(LocalTime.of(h, 30).toString())
                    .status("AVAILABLE")
                    .build());
            // Slot 2: h:30 - (h+1):00
            defaultSlots.add(CourtSlotResponse.builder()
                    .startTime(LocalTime.of(h, 30).toString())
                    .endTime(LocalTime.of(h + 1 == 24 ? 23 : h + 1, h + 1 == 24 ? 59 : 0).toString())
                    .status("AVAILABLE")
                    .build());
        }
        return defaultSlots;
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

    @Transactional
    public CourtResponse updateCourt(UUID venueId, UUID courtId, UpdateCourtRequest request) {
        log.info("Updating court {} for venue {}", courtId, venueId);
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân"));

        if (!court.getVenue().getId().equals(venueId)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Sân không thuộc về cơ sở này");
        }

        if (request.getName() != null) court.setName(request.getName());
        if (request.getCourtType() != null) court.setCourtType(request.getCourtType());
        if (request.getDescription() != null) court.setDescription(request.getDescription());
        if (request.getStatus() != null) court.setStatus(request.getStatus());

        return venueMapper.toCourtResponse(courtRepository.save(court));
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

    @Transactional
    public void updateCourtAvailability(UUID venueId, UUID courtId, UpdateCourtAvailabilityRequest request) {
        log.info("Updating availability for court {} from {} to {}", courtId, request.getStartDate(), request.getEndDate());
        
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân lẻ"));

        if (!court.getVenue().getId().equals(venueId)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Sân không thuộc về cơ sở này");
        }

        // 1. Delete existing slots in the range
        courtSlotRepository.deleteByCourtIdAndSlotDateBetween(courtId, request.getStartDate(), request.getEndDate());

        // 2. Generate new slots
        List<CourtSlot> newSlots = new ArrayList<>();
        LocalDate current = request.getStartDate();
        while (!current.isAfter(request.getEndDate())) {
            Venue venue = court.getVenue();
            // Default to 5:00 - 22:00 if not set
            int startHour = 5;
            int endHour = 22;
            
            try {
                if (venue.getOpenTime() != null) startHour = venue.getOpenTime().getHour();
                if (venue.getCloseTime() != null) {
                    endHour = venue.getCloseTime().getHour();
                    if (endHour == 0) endHour = 24; // Handle midnight as 24:00
                }
            } catch (Exception e) {
                log.warn("Failed to parse venue operating hours, using defaults: {}", e.getMessage());
            }

            for (int h = startHour; h < endHour; h++) {
                // Slot 1: h:00 - h:30
                String time1 = String.format("%02d:00", h);
                String status1 = request.getAvailableSlots().contains(time1) ? "AVAILABLE" : "LOCKED";
                newSlots.add(CourtSlot.builder()
                        .court(court)
                        .slotDate(current)
                        .startTime(LocalTime.of(h, 0))
                        .endTime(LocalTime.of(h, 30))
                        .status(status1)
                        .build());

                // Slot 2: h:30 - (h+1):00
                String time2 = String.format("%02d:30", h);
                String status2 = request.getAvailableSlots().contains(time2) ? "AVAILABLE" : "LOCKED";
                newSlots.add(CourtSlot.builder()
                        .court(court)
                        .slotDate(current)
                        .startTime(LocalTime.of(h, 30))
                        .endTime(LocalTime.of(h + 1 == 24 ? 23 : h + 1, h + 1 == 24 ? 59 : 0))
                        .status(status2)
                        .build());
            }
            current = current.plusDays(1);
        }
        
        courtSlotRepository.saveAll(newSlots);
        log.info("Successfully updated availability for court {} over {} days", courtId, newSlots.size());
    }

    public List<PriceRuleResponse> findPriceRulesByVenueId(UUID venueId) {
        log.info("Fetching price rules for venue {}", venueId);
        return priceRuleRepository.findByVenueId(venueId).stream()
                .map(venueMapper::toPriceRuleResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PriceRuleResponse createPriceRule(UUID venueId, CreatePriceRuleRequest request) {
        log.info("Creating price rule for venue {}", venueId);
        PriceRule rule = PriceRule.builder()
                .venueId(venueId)
                .courtId(request.getCourtId())
                .dayOfWeek(request.getDayOfWeek())
                .startTime(LocalTime.parse(request.getStartTime()))
                .endTime(LocalTime.parse(request.getEndTime()))
                .pricePerHour(request.getPricePerHour())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        return venueMapper.toPriceRuleResponse(priceRuleRepository.save(rule));
    }

    @Transactional
    public void deletePriceRule(UUID venueId, UUID ruleId) {
        log.info("Deleting price rule {} for venue {}", ruleId, venueId);
        PriceRule rule = priceRuleRepository.findById(ruleId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy quy tắc giá"));
        
        if (!rule.getVenueId().equals(venueId)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Quy tắc giá không thuộc về cơ sở này");
        }

        priceRuleRepository.delete(rule);
    }
}





