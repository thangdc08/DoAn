package com.badminton.communityservice.service;

import com.badminton.communityservice.dto.*;
import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.entity.Participant;
import com.badminton.communityservice.repository.MatchPostRepository;
import com.badminton.communityservice.repository.ParticipantRepository;
import com.badminton.communityservice.specification.MatchPostSpecification;
import com.badminton.common.exception.AppException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchPostService {

  private final MatchPostRepository matchPostRepository;
  private final ParticipantRepository participantRepository;
  private final CommunityEventPublisher eventPublisher;
  private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
  private static final String META_PREFIX = "\n__MATCH_META__:";
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Transactional
  public MatchPostResponse createMatchPost(UUID hostId, CreateMatchPostRequest request) {
    log.info("Creating match post for host: {}", hostId);

    // Validation
    if (request.getStartTime().isBefore(LocalDateTime.now().plusMinutes(30))) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Start time must be at least 30 minutes from now");
    }

    if (request.getEndTime().isBefore(request.getStartTime())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "End time must be after start time");
    }

    if (request.getVenueId() == null &&
        (request.getLocationText() == null || request.getLocationText().isBlank())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Either venueId or locationText is required");
    }

    // Create entity
    String persistedDescription = appendMetaDescription(
        request.getDescription(),
        request.getGenderPreference(),
        request.getPaymentType(),
        request.getContactPhone()
    );

    List<String> resolvedLevels = resolveLevels(request);

    MatchPost matchPost = MatchPost.builder()
        .hostId(hostId)
        .authorId(hostId)
        .title(request.getTitle())
        .description(persistedDescription)
        .level(resolvedLevels.get(0))
        .levels(resolvedLevels)
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .maxParticipants(request.getMaxParticipants())
        .currentParticipants(0) // Host is organizer, not counted as a slot participant
        .joinMode(request.getJoinMode())
        .status("OPEN")
        .likeCount(0)
        .commentCount(0)
        .build();

    // Set location
    if (request.getLatitude() != null && request.getLongitude() != null) {
      matchPost.setLatitude(request.getLatitude());
      matchPost.setLongitude(request.getLongitude());
      Point point = geometryFactory.createPoint(new Coordinate(request.getLongitude(), request.getLatitude()));
      matchPost.setLocation(point);
    }

    if (request.getLocationText() != null) {
      matchPost.setVenueName(request.getLocationText());
    }

    matchPost = matchPostRepository.save(matchPost);

    // Publish event
    eventPublisher.publishMatchPostCreated(matchPost);

    log.info("Match post created with ID: {}", matchPost.getId());
    return toResponse(matchPost);
  }

  public Page<MatchPostResponse> searchMatchPosts(Specification<MatchPost> spec, Pageable pageable) {
    return matchPostRepository.findAll(spec, pageable).map(this::toResponse);
  }

  public MatchPostResponse getMatchPostById(UUID id) {
    MatchPost matchPost = matchPostRepository.findById(id)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));
    return toResponse(matchPost);
  }

  public List<MatchPostResponse> findNearbyMatches(double lat, double lng, double radiusKm, int limit) {
    double radiusMeters = radiusKm * 1000;
    List<MatchPost> matches = matchPostRepository.findNearbyMatches(lat, lng, radiusMeters, "OPEN", limit);
    return matches.stream().map(this::toResponse).collect(Collectors.toList());
  }


  public Page<MatchPostResponse> getJoinedMatches(UUID userId, String status, Pageable pageable) {
    log.info("Fetching joined matches for user: {}", userId);

    // Logic: Tìm tất cả các kèo mà user là host HOẶC user là một participant
    // Điều này yêu cầu một query phức tạp hơn hoặc kết hợp 2 kết quả.
    // Tối ưu nhất là dùng Specification với join tới Participant.

    Specification<MatchPost> spec = Specification
            .where(MatchPostSpecification.isHostOrParticipant(userId))
            .and(MatchPostSpecification.hasStatus(status));

    return matchPostRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional
  public void closeMatchPost(UUID matchPostId, UUID userId) {
    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    if (!matchPost.getHostId().equals(userId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Only host can close match");
    }

    if (!"OPEN".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Match is not open");
    }

    matchPost.setStatus("CLOSED");
    matchPostRepository.save(matchPost);
    log.info("Match post {} closed by host {}", matchPostId, userId);
  }

  @Transactional
  public void reopenMatchPost(UUID matchPostId, UUID userId) {
    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    if (!matchPost.getHostId().equals(userId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Only host can reopen match");
    }

    if (!"CLOSED".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Match is not closed");
    }

    if (matchPost.getStartTime().isBefore(LocalDateTime.now())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Cannot reopen match that has already started");
    }

    matchPost.setStatus("OPEN");
    matchPostRepository.save(matchPost);
    log.info("Match post {} reopened by host {}", matchPostId, userId);
  }

  @Transactional
  public void finishMatchPost(UUID matchPostId, UUID userId) {
    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    if (!matchPost.getHostId().equals(userId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Only host can finish match");
    }

    if ("FINISHED".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Match is already finished");
    }

    matchPost.setStatus("FINISHED");
    matchPostRepository.save(matchPost);
    log.info("Match post {} finished by host {}", matchPostId, userId);
  }

  private MatchPostResponse toResponse(MatchPost matchPost) {
    ParsedMeta parsedMeta = extractMeta(matchPost.getDescription());

    return MatchPostResponse.builder()
        .id(matchPost.getId())
        .hostId(matchPost.getHostId())
        .title(matchPost.getTitle())
        .description(parsedMeta.cleanDescription)
        .level(matchPost.getLevel())
        .levels(matchPost.getLevels() == null || matchPost.getLevels().isEmpty()
            ? List.of(matchPost.getLevel())
            : matchPost.getLevels())
        .startTime(matchPost.getStartTime())
        .endTime(matchPost.getEndTime())
        .venueName(matchPost.getVenueName())
        .venueAddress(matchPost.getVenueAddress())
        .latitude(matchPost.getLatitude())
        .longitude(matchPost.getLongitude())
        .maxParticipants(matchPost.getMaxParticipants())
        .currentParticipants(matchPost.getCurrentParticipants())
        .joinMode(matchPost.getJoinMode())
        .status(matchPost.getStatus())
        .likeCount(matchPost.getLikeCount())
        .commentCount(matchPost.getCommentCount())
        .genderPreference(parsedMeta.genderPreference)
        .paymentType(parsedMeta.paymentType)
        .contactPhone(parsedMeta.contactPhone)
        .createdAt(matchPost.getCreatedAt())
        .updatedAt(matchPost.getUpdatedAt())
        .build();
  }

  private List<String> resolveLevels(CreateMatchPostRequest request) {
    Set<String> merged = new LinkedHashSet<>();
    if (request.getLevels() != null) {
      request.getLevels().stream()
          .filter(v -> v != null && !v.isBlank())
          .map(String::trim)
          .forEach(merged::add);
    }
    if (request.getLevel() != null && !request.getLevel().isBlank()) {
      merged.add(request.getLevel().trim());
    }
    if (merged.isEmpty()) {
      merged.add("INTERMEDIATE");
    }
    return new ArrayList<>(merged);
  }

  private String appendMetaDescription(String description, String genderPreference, String paymentType, String contactPhone) {
    try {
      Map<String, String> meta = new HashMap<>();
      if (genderPreference != null && !genderPreference.isBlank()) meta.put("genderPreference", genderPreference);
      if (paymentType != null && !paymentType.isBlank()) meta.put("paymentType", paymentType);
      if (contactPhone != null && !contactPhone.isBlank()) meta.put("contactPhone", contactPhone);

      if (meta.isEmpty()) return description;
      String base = description == null ? "" : description.trim();
      return base + META_PREFIX + objectMapper.writeValueAsString(meta);
    } catch (Exception e) {
      log.warn("Cannot append match metadata, fallback to plain description", e);
      return description;
    }
  }

  private ParsedMeta extractMeta(String rawDescription) {
    if (rawDescription == null || !rawDescription.contains(META_PREFIX)) {
      return extractLegacyMeta(rawDescription);
    }
    try {
      int idx = rawDescription.lastIndexOf(META_PREFIX);
      String clean = rawDescription.substring(0, idx).trim();
      String metaJson = rawDescription.substring(idx + META_PREFIX.length()).trim();
      Map<String, String> meta = objectMapper.readValue(metaJson, new TypeReference<Map<String, String>>() {});
      return ParsedMeta.builder()
          .cleanDescription(clean)
          .genderPreference(meta.get("genderPreference"))
          .paymentType(meta.get("paymentType"))
          .contactPhone(meta.get("contactPhone"))
          .build();
    } catch (Exception e) {
      log.warn("Cannot parse match metadata, keep original description", e);
      return extractLegacyMeta(rawDescription);
    }
  }

  private ParsedMeta extractLegacyMeta(String rawDescription) {
    if (rawDescription == null) {
      return ParsedMeta.builder().cleanDescription(null).build();
    }

    String gender = null;
    String payment = null;
    String clean = rawDescription;

    String[] lines = rawDescription.split("\\r?\\n");
    StringBuilder cleanBuilder = new StringBuilder();
    for (String line : lines) {
      String trimmed = line.trim();
      if (trimmed.startsWith("Gioi tinh:")) {
        gender = trimmed.replace("Gioi tinh:", "").trim();
        continue;
      }
      if (trimmed.startsWith("Hinh thuc dong phi:")) {
        payment = trimmed.replace("Hinh thuc dong phi:", "").trim();
        continue;
      }
      if (!trimmed.startsWith("Chi phi moi nguoi:")) {
        if (cleanBuilder.length() > 0) cleanBuilder.append("\n");
        cleanBuilder.append(line);
      }
    }
    clean = cleanBuilder.toString().trim();

    return ParsedMeta.builder()
        .cleanDescription(clean)
        .genderPreference(gender)
        .paymentType(payment)
        .build();
  }

  @lombok.Builder
  private static class ParsedMeta {
    private String cleanDescription;
    private String genderPreference;
    private String paymentType;
    private String contactPhone;
  }
}
