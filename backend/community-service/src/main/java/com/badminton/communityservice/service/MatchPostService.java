package com.badminton.communityservice.service;

import com.badminton.communityservice.dto.*;
import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.entity.Participant;
import com.badminton.communityservice.repository.MatchPostRepository;
import com.badminton.communityservice.repository.ParticipantRepository;
import com.badminton.common.exception.AppException;
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
import java.util.List;
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
        (request.getLocationText() == null || request.getLatitude() == null || request.getLongitude() == null)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Either venueId or locationText with coordinates is required");
    }

    // Create entity
    MatchPost matchPost = MatchPost.builder()
        .hostId(hostId)
        .title(request.getTitle())
        .description(request.getDescription())
        .level(request.getLevel())
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .maxParticipants(request.getMaxParticipants())
        .currentParticipants(1) // Host counts as first participant
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

  public List<MatchPostResponse> findNearbyMatches(double lat, double lng, double radiusKm, int limit) {
    double radiusMeters = radiusKm * 1000;
    List<MatchPost> matches = matchPostRepository.findNearbyMatches(lat, lng, radiusMeters, "OPEN", limit);
    return matches.stream().map(this::toResponse).collect(Collectors.toList());
  }

  public MatchPostResponse getMatchPostById(UUID id) {
    MatchPost matchPost = matchPostRepository.findById(id)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));
    return toResponse(matchPost);
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
    return MatchPostResponse.builder()
        .id(matchPost.getId())
        .hostId(matchPost.getHostId())
        .title(matchPost.getTitle())
        .description(matchPost.getDescription())
        .level(matchPost.getLevel())
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
        .createdAt(matchPost.getCreatedAt())
        .updatedAt(matchPost.getUpdatedAt())
        .build();
  }
}
