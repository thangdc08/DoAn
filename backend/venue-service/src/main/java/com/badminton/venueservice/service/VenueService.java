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
import com.badminton.venueservice.entity.VenueRating;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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
  private final RestTemplate restTemplate;
  private final VenueRatingRepository venueRatingRepository;
  private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

  @Value("${app.services.booking-service.url:http://localhost:8083}")
  private String bookingServiceUrl;

  private String generateSlug(String name) {
    return name.toLowerCase()
        .replaceAll("[^a-z0-9\\s]", "")
        .replaceAll("\\s+", "-") + "-" + UUID.randomUUID().toString().substring(0, 8);
  }

  public List<VenueResponse> findAll() {
    log.info("Fetching all venues");
    return venueRepository.findAll().stream()
        .filter(v -> v.getStatus() == VenueStatus.APPROVED)
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
    return venueRepository.findById(id).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Venue not found"));
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

    if (request.getName() != null)
      venue.setName(request.getName());
    if (request.getDescription() != null)
      venue.setDescription(request.getDescription());
    if (request.getAddress() != null)
      venue.setAddress(request.getAddress());
    if (request.getWard() != null)
      venue.setWard(request.getWard());
    if (request.getCity() != null)
      venue.setCity(request.getCity());
    if (request.getPhone() != null)
      venue.setPhone(request.getPhone());
    if (request.getEmail() != null)
      venue.setEmail(request.getEmail());
    if (request.getUtilities() != null)
      venue.setUtilities(request.getUtilities());
    if (request.getPolicy() != null)
      venue.setPolicy(request.getPolicy());

    if (request.getOpenTime() != null)
      venue.setOpenTime(LocalTime.parse(request.getOpenTime()));
    if (request.getCloseTime() != null)
      venue.setCloseTime(LocalTime.parse(request.getCloseTime()));

    if (request.getLatitude() != null)
      venue.setLatitude(request.getLatitude());
    if (request.getLongitude() != null)
      venue.setLongitude(request.getLongitude());

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
    if (endHour == 0)
      endHour = 24;

    for (int i = 1; i <= request.getCourtCount(); i++) {
      Court court = Court.builder()
          .venue(savedVenue)
          .name("Sân " + i)
          .courtType("STANDARD")
          .status("ACTIVE")
          .displayOrder(i - 1)
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
              .endTime(nextHalfHourEnd(h))
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

    BigDecimal defaultPrice = request.getDefaultPrice() != null ? request.getDefaultPrice() : BigDecimal.valueOf(80000);
    Court court = Court.builder()
        .venue(venue)
        .name(request.getName())
        .courtType(request.getCourtType())
        .description(request.getDescription())
        .status("ACTIVE")
        .displayOrder(venue.getCourtCount() - 1)
        .defaultPrice(defaultPrice)
        .build();

    Court savedCourt = courtRepository.save(court);

    // Generate slots for next 30 days
    int startHour = venue.getOpenTime() != null ? venue.getOpenTime().getHour() : 5;
    int endHour = venue.getCloseTime() != null ? venue.getCloseTime().getHour() : 22;
    if (endHour == 0)
      endHour = 24;

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
            .endTime(nextHalfHourEnd(h))
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

    Court court = courtRepository.findById(courtId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân lẻ"));

    List<CourtSlot> slots = courtSlotRepository.findByCourtIdAndSlotDate(courtId, date);
    Map<String, String> activeBookingStatuses = getActiveBookingStatuses(courtId, date);

    if (!slots.isEmpty()) {
      return slots.stream()
          .map(s -> {
            LocalDateTime startDateTime = LocalDateTime.of(s.getSlotDate(), s.getStartTime());
            LocalDateTime endDateTime = buildSlotEndDateTime(s.getSlotDate(), s.getStartTime(), s.getEndTime());
            BigDecimal slotPrice = calculatePrice(courtId, startDateTime, endDateTime);
            return CourtSlotResponse.builder()
                .startTime(s.getStartTime().toString())
                .endTime(s.getEndTime().toString())
                .status(activeBookingStatuses.getOrDefault(normalizeTimeKey(s.getStartTime()), s.getStatus()))
                .price(slotPrice)
                .build();
          })
          .collect(Collectors.toList());
    }

    // Fallback to default venue hours if no specific slots configured
    Venue venue = court.getVenue();

    int startHour = venue.getOpenTime() != null ? venue.getOpenTime().getHour() : 5;
    int endHour = venue.getCloseTime() != null ? venue.getCloseTime().getHour() : 22;
    if (endHour == 0)
      endHour = 24;

    List<CourtSlotResponse> defaultSlots = new ArrayList<>();
    for (int h = startHour; h < endHour; h++) {
      // Slot 1: h:00 - h:30
      LocalTime t1Start = LocalTime.of(h, 0);
      LocalTime t1End = LocalTime.of(h, 30);
      BigDecimal price1 = calculatePrice(courtId, LocalDateTime.of(date, t1Start), LocalDateTime.of(date, t1End));
      defaultSlots.add(CourtSlotResponse.builder()
          .startTime(t1Start.toString())
          .endTime(t1End.toString())
          .status(activeBookingStatuses.getOrDefault(normalizeTimeKey(t1Start), "AVAILABLE"))
          .price(price1)
          .build());

      // Slot 2: h:30 - (h+1):00
      LocalTime t2Start = LocalTime.of(h, 30);
      LocalTime t2End = nextHalfHourEnd(h);
      BigDecimal price2 = calculatePrice(
          courtId,
          LocalDateTime.of(date, t2Start),
          buildSlotEndDateTime(date, t2Start, t2End));
      defaultSlots.add(CourtSlotResponse.builder()
          .startTime(t2Start.toString())
          .endTime(t2End.toString())
          .status(activeBookingStatuses.getOrDefault(normalizeTimeKey(t2Start), "AVAILABLE"))
          .price(price2)
          .build());
    }
    return defaultSlots;
  }

  private Map<String, String> getActiveBookingStatuses(UUID courtId, LocalDate date) {
    try {
      String url = UriComponentsBuilder
          .fromHttpUrl(bookingServiceUrl)
          .path("/api/bookings/locks/active")
          .queryParam("courtId", courtId)
          .queryParam("date", date)
          .toUriString();

      ResponseEntity<com.badminton.common.dto.ApiResponse<List<ActiveBookingSlotResponse>>> response = restTemplate
          .exchange(
              url,
              HttpMethod.GET,
              null,
              new ParameterizedTypeReference<>() {
              });

      List<ActiveBookingSlotResponse> locks = response.getBody() != null && response.getBody().getResult() != null
          ? response.getBody().getResult()
          : List.of();

      return locks.stream()
          .collect(Collectors.toMap(
              lock -> normalizeTimeKey(lock.getStartTime().toLocalTime()),
              lock -> "BOOKED".equals(lock.getStatus()) ? "BOOKED" : "LOCKED",
              (existing, incoming) -> "BOOKED".equals(existing) || "BOOKED".equals(incoming) ? "BOOKED" : "LOCKED"));
    } catch (Exception ex) {
      log.warn("Failed to fetch active booking statuses for court {} on {}: {}", courtId, date, ex.getMessage());
      return Map.of();
    }
  }

  private String normalizeTimeKey(LocalTime time) {
    return String.format("%02d:%02d", time.getHour(), time.getMinute());
  }

  public List<CourtResponse> findCourtsByVenueId(UUID venueId) {
    log.info("Fetching courts for venue {}", venueId);
    List<Court> courts = courtRepository.findByVenueIdOrderByDisplayOrderAsc(venueId);
    log.info("Found {} courts. Order: {}", courts.size(),
        courts.stream().map(c -> c.getName() + "(Order:" + c.getDisplayOrder() + ")")
            .collect(Collectors.joining(", ")));
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

    if (request.getName() != null)
      court.setName(request.getName());
    if (request.getCourtType() != null)
      court.setCourtType(request.getCourtType());
    if (request.getDescription() != null)
      court.setDescription(request.getDescription());
    if (request.getStatus() != null)
      court.setStatus(request.getStatus());
    if (request.getDefaultPrice() != null)
      court.setDefaultPrice(request.getDefaultPrice());

    return venueMapper.toCourtResponse(courtRepository.save(court));
  }

  public BigDecimal calculatePrice(UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
    log.info("Calculating price for court {} from {} to {}", courtId, startTime, endTime);
    Court court = courtRepository.findById(courtId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Court not found"));

    BigDecimal hourlyRate = getPriceFromRules(court, startTime);
    if (!endTime.isAfter(startTime)) {
      endTime = endTime.plusDays(1);
    }

    long minutes = java.time.Duration.between(startTime, endTime).toMinutes();
    double hours = minutes / 60.0;
    return hourlyRate.multiply(BigDecimal.valueOf(hours));
  }

  private BigDecimal getPriceFromRules(Court court, LocalDateTime startTime) {
    int dayOfWeek = startTime.getDayOfWeek().getValue();
    LocalTime start = startTime.toLocalTime();

    List<PriceRule> rules = priceRuleRepository.findByVenueIdAndDayOfWeek(court.getVenue().getId(), dayOfWeek);

    return rules.stream()
        .filter(r -> !start.isBefore(r.getStartTime()) && start.isBefore(r.getEndTime()))
        .findFirst()
        .map(PriceRule::getPricePerHour)
        .orElse(court.getDefaultPrice() != null ? court.getDefaultPrice() : BigDecimal.valueOf(80000));
  }

  private LocalTime nextHalfHourEnd(int hour) {
    return hour + 1 == 24 ? LocalTime.MIDNIGHT : LocalTime.of(hour + 1, 0);
  }

  private LocalDateTime buildSlotEndDateTime(LocalDate date, LocalTime slotStart, LocalTime slotEnd) {
    return LocalDateTime.of(slotEnd.isAfter(slotStart) ? date : date.plusDays(1), slotEnd);
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
        if (venue.getOpenTime() != null)
          startHour = venue.getOpenTime().getHour();
        if (venue.getCloseTime() != null) {
          endHour = venue.getCloseTime().getHour();
          if (endHour == 0)
            endHour = 24; // Handle midnight as 24:00
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
            .endTime(nextHalfHourEnd(h))
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
    LocalTime startTime = LocalTime.parse(request.getStartTime());
    LocalTime endTime = LocalTime.parse(request.getEndTime());
    validatePriceRuleRequest(venueId, request, startTime, endTime);

    PriceRule rule = PriceRule.builder()
        .venueId(venueId)
        .courtId(request.getCourtId())
        .dayOfWeek(request.getDayOfWeek())
        .startTime(startTime)
        .endTime(endTime)
        .pricePerHour(request.getPricePerHour())
        .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
        .build();
    return venueMapper.toPriceRuleResponse(priceRuleRepository.save(rule));
  }

  private void validatePriceRuleRequest(UUID venueId, CreatePriceRuleRequest request, LocalTime startTime,
      LocalTime endTime) {
    if (request.getDayOfWeek() == null || request.getDayOfWeek() < 1 || request.getDayOfWeek() > 7) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Ngày áp dụng không hợp lệ");
    }

    if (!startTime.isBefore(endTime)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
    }

    if (request.getPricePerHour() == null || request.getPricePerHour().compareTo(BigDecimal.ZERO) <= 0) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Giá theo giờ phải lớn hơn 0");
    }

    priceRuleRepository.findByVenueIdAndDayOfWeek(venueId, request.getDayOfWeek()).stream()
        .filter(rule -> "ACTIVE".equalsIgnoreCase(rule.getStatus()))
        .filter(rule -> isSamePriceScope(request.getCourtId(), rule.getCourtId()))
        .filter(rule -> isTimeRangeOverlapping(startTime, endTime, rule.getStartTime(), rule.getEndTime()))
        .findFirst()
        .ifPresent(rule -> {
          throw new AppException(
              HttpStatus.CONFLICT,
              String.format(
                  "Khung giờ %s - %s bị trùng với quy tắc đã có %s - %s",
                  startTime,
                  endTime,
                  rule.getStartTime(),
                  rule.getEndTime()));
        });
  }

  private boolean isSamePriceScope(UUID requestedCourtId, UUID existingCourtId) {
    return requestedCourtId == null || existingCourtId == null || requestedCourtId.equals(existingCourtId);
  }

  private boolean isTimeRangeOverlapping(LocalTime startTime, LocalTime endTime, LocalTime existingStartTime,
      LocalTime existingEndTime) {
    return startTime.isBefore(existingEndTime) && existingStartTime.isBefore(endTime);
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

  /**
   * Khóa hoặc mở khóa một khung giờ (slot) cụ thể của sân con.
   * Phương thức chính tuân thủ quy chuẩn SRP và có độ dài dưới 20 dòng.
   */
  @Transactional
  public CourtSlotResponse toggleCourtSlotLock(UUID venueId, UUID courtId, ToggleSlotLockRequest request) {
    log.info("Toggling slot lock for court {} on {}: {} - {} (lock: {})",
        courtId, request.getSlotDate(), request.getStartTime(), request.getEndTime(), request.isLock());

    Court court = verifyCourtBelongsToVenue(venueId, courtId);
    LocalTime startTime = LocalTime.parse(request.getStartTime());
    LocalTime endTime = LocalTime.parse(request.getEndTime());

    CourtSlot slot = findOrInitializeSlot(court, request.getSlotDate(), startTime, endTime);
    updateSlotStatus(slot, request.isLock());

    CourtSlot savedSlot = courtSlotRepository.save(slot);
    return mapToCourtSlotResponse(savedSlot);
  }

  /**
   * Xác minh xem sân lẻ có thuộc về cơ sở (venue) này hay không.
   */
  private Court verifyCourtBelongsToVenue(UUID venueId, UUID courtId) {
    Court court = courtRepository.findById(courtId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sân lẻ"));
    if (!court.getVenue().getId().equals(venueId)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Sân lẻ không thuộc về cơ sở này");
    }
    return court;
  }

  /**
   * Tìm slot đã tồn tại trong CSDL hoặc khởi tạo một slot mới nếu chưa có.
   */
  private CourtSlot findOrInitializeSlot(Court court, LocalDate date, LocalTime start, LocalTime end) {
    return courtSlotRepository.findByCourtIdAndSlotDateAndStartTimeAndEndTime(court.getId(), date, start, end)
        .orElseGet(() -> CourtSlot.builder()
            .court(court)
            .slotDate(date)
            .startTime(start)
            .endTime(end)
            .status("AVAILABLE")
            .build());
  }

  /**
   * Cập nhật trạng thái của slot dựa trên yêu cầu khóa/mở khóa.
   * Kiểm tra xung đột nếu slot đã được đặt trước đó.
   */
  private void updateSlotStatus(CourtSlot slot, boolean shouldLock) {
    if (shouldLock) {
      if ("BOOKED".equals(slot.getStatus())) {
        throw new AppException(HttpStatus.BAD_REQUEST,
            "Sân đã có khách đặt lịch vào khung giờ này. Vui lòng hủy lịch đặt trước khi khóa.");
      }
      slot.setStatus("LOCKED");
    } else {
      slot.setStatus("AVAILABLE");
    }
  }

  /**
   * Chuyển đổi thực thể CourtSlot sang DTO CourtSlotResponse.
   */
  private CourtSlotResponse mapToCourtSlotResponse(CourtSlot slot) {
    return CourtSlotResponse.builder()
        .startTime(slot.getStartTime().toString())
        .endTime(slot.getEndTime().toString())
        .status(slot.getStatus())
        .build();
  }

  public List<VenueResponse> findNearbyVenues(Double lat, Double lng, Double radiusKm, Integer limit) {
    log.info("Finding venues nearby lat={}, lng={}, radiusKm={}, limit={}", lat, lng, radiusKm, limit);
    if (lat == null || lng == null) {
      return findAll();
    }
    if (radiusKm == null)
      radiusKm = 10.0;
    if (limit == null)
      limit = 20;

    Point point = geometryFactory.createPoint(new Coordinate(lng, lat));
    List<Venue> venues = venueRepository.findNearby(point, radiusKm * 1000);
    return venues.stream()
        .filter(v -> v.getStatus() == VenueStatus.APPROVED)
        .limit(limit)
        .map(this::toVenueResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public VenueRatingResponse createVenueRating(UUID userId, UUID venueId, VenueRatingRequest request) {
    log.info("User {} rating venue {} with {} stars", userId, venueId, request.getStars());

    if (request.getStars() == null || request.getStars() < 1 || request.getStars() > 5) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Số sao đánh giá phải từ 1 đến 5");
    }

    Boolean hasPaid = checkUserHasPaidBooking(userId, venueId);
    if (!hasPaid) {
      throw new AppException(HttpStatus.FORBIDDEN,
          "Bạn chỉ có thể đánh giá sân sau khi đã hoàn thành đặt sân và thanh toán thành công");
    }

    VenueRating rating = venueRatingRepository.findByVenueIdAndUserId(venueId, userId)
        .orElse(VenueRating.builder()
            .userId(userId)
            .venueId(venueId)
            .build());

    rating.setStars(request.getStars());
    rating.setComment(request.getComment());
    venueRatingRepository.save(rating);

    Double avg = venueRatingRepository.getAverageStarsByVenueId(venueId);
    long count = venueRatingRepository.countByVenueId(venueId);

    Venue venue = findById(venueId);
    venue.setRatingAvg(avg != null ? avg : 0.0);
    venue.setRatingCount((int) count);
    venueRepository.save(venue);

    return VenueRatingResponse.builder()
        .id(rating.getId())
        .venueId(rating.getVenueId())
        .userId(rating.getUserId())
        .stars(rating.getStars())
        .comment(rating.getComment())
        .createdAt(rating.getCreatedAt() != null ? rating.getCreatedAt() : LocalDateTime.now())
        .build();
  }

  public Page<VenueRatingResponse> getVenueRatings(UUID venueId, Pageable pageable) {
    log.info("Fetching ratings for venue {}", venueId);
    return venueRatingRepository.findByVenueId(venueId, pageable)
        .map(r -> VenueRatingResponse.builder()
            .id(r.getId())
            .venueId(r.getVenueId())
            .userId(r.getUserId())
            .stars(r.getStars())
            .comment(r.getComment())
            .createdAt(r.getCreatedAt())
            .build());
  }

  private Boolean checkUserHasPaidBooking(UUID userId, UUID venueId) {
    try {
      String url = UriComponentsBuilder
          .fromHttpUrl(bookingServiceUrl)
          .path("/api/bookings/internal/has-paid")
          .queryParam("userId", userId)
          .queryParam("venueId", venueId)
          .toUriString();
      ResponseEntity<Boolean> response = restTemplate.getForEntity(url, Boolean.class);
      return response.getBody() != null && response.getBody();
    } catch (Exception e) {
      log.error("Failed to check if user has paid booking from booking-service", e);
      return false;
    }
  }

  // Admin methods
  public List<VenueResponse> findVenuesByStatus(String status) {
    log.info("Finding venues with status: {}", status);
    VenueStatus venueStatus;
    try {
      venueStatus = VenueStatus.valueOf(status);
    } catch (Exception ex) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Trạng thái sân không hợp lệ: " + status);
    }

    return venueRepository.findByStatus(venueStatus).stream()
        .map(this::toVenueResponse)
        .collect(Collectors.toList());
  }

  public Page<VenueResponse> findAllVenuesForAdmin(String status, String search, Pageable pageable) {
    log.info("Admin finding all venues with status={}, search={}", status, search);

    List<Venue> venues = venueRepository.findAll();

    // Filter by status
    if (status != null && !status.isEmpty()) {
      VenueStatus venueStatus;
      try {
        venueStatus = VenueStatus.valueOf(status);
      } catch (Exception ex) {
        throw new AppException(HttpStatus.BAD_REQUEST, "Trạng thái sân không hợp lệ: " + status);
      }
      venues = venues.stream()
          .filter(v -> v.getStatus() == venueStatus)
          .collect(Collectors.toList());
    }

    // Filter by search
    if (search != null && !search.isEmpty()) {
      String searchLower = search.toLowerCase();
      venues = venues.stream()
          .filter(v -> v.getName().toLowerCase().contains(searchLower) ||
              v.getAddress().toLowerCase().contains(searchLower) ||
              (v.getCity() != null && v.getCity().toLowerCase().contains(searchLower)))
          .collect(Collectors.toList());
    }

    // Manual pagination
    int start = (int) pageable.getOffset();
    if (start >= venues.size()) {
      return new org.springframework.data.domain.PageImpl<>(List.of(), pageable, venues.size());
    }
    int end = Math.min((start + pageable.getPageSize()), venues.size());
    List<VenueResponse> pageContent = venues.subList(start, end).stream()
        .map(this::toVenueResponse)
        .collect(Collectors.toList());

    return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, venues.size());
  }

  @Transactional
  public VenueResponse approveVenue(UUID venueId, UUID adminId) {
    log.info("Admin {} approving venue {}", adminId, venueId);

    Venue venue = findById(venueId);

    if (venue.getStatus() != VenueStatus.PENDING_APPROVAL) {
      throw new AppException(HttpStatus.CONFLICT, "Venue is not pending approval");
    }

    venue.setStatus(VenueStatus.APPROVED);
    Venue savedVenue = venueRepository.save(venue);

    // TODO: Publish VenueApproved event
    log.info("Venue {} approved by admin {}", venueId, adminId);

    return toVenueResponse(savedVenue);
  }

  @Transactional
  public VenueResponse rejectVenue(UUID venueId, UUID adminId, String reason) {
    log.info("Admin {} rejecting venue {} with reason: {}", adminId, venueId, reason);

    Venue venue = findById(venueId);

    if (venue.getStatus() != VenueStatus.PENDING_APPROVAL) {
      throw new AppException(HttpStatus.CONFLICT, "Venue is not pending approval");
    }

    venue.setStatus(VenueStatus.REJECTED);
    // TODO: Store rejection reason in a separate field or audit log
    Venue savedVenue = venueRepository.save(venue);

    log.info("Venue {} rejected by admin {}", venueId, adminId);

    return toVenueResponse(savedVenue);
  }

  @Transactional
  public void deleteVenueByAdmin(UUID venueId, UUID adminId) {
    log.info("Admin {} deleting venue {}", adminId, venueId);

    Venue venue = findById(venueId);

    // Check if venue has active bookings
    // TODO: Call booking service to check for active bookings

    // Delete related data first
    // remove all court slots belonging to courts of this venue
    courtSlotRepository.deleteByCourt_Venue_Id(venueId);
    priceRuleRepository.deleteByVenueId(venueId);
    venueRatingRepository.deleteByVenueId(venueId);
    venueImageRepository.deleteByVenueId(venueId);
    courtRepository.deleteByVenueId(venueId);

    // Delete venue
    venueRepository.delete(venue);

    log.info("Venue {} deleted by admin {}", venueId, adminId);
  }
}
