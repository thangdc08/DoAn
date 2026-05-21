package com.badminton.communityservice.service;

import com.badminton.communityservice.dto.CreatePlayerRatingRequest;
import com.badminton.communityservice.dto.PlayerRatingResponse;
import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.entity.Participant;
import com.badminton.communityservice.entity.PlayerRating;
import com.badminton.communityservice.repository.MatchPostRepository;
import com.badminton.communityservice.repository.ParticipantRepository;
import com.badminton.communityservice.repository.PlayerRatingRepository;
import com.badminton.common.exception.AppException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerRatingService {

  private final PlayerRatingRepository playerRatingRepository;
  private final MatchPostRepository matchPostRepository;
  private final ParticipantRepository participantRepository;
  private final CommunityEventPublisher eventPublisher;

  @Transactional
  public PlayerRatingResponse ratePlayer(UUID matchPostId, UUID raterId, CreatePlayerRatingRequest request) {
    log.info("User {} rating player {} for match {}", raterId, request.getRateeUserId(), matchPostId);

    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    // Only host can rate
    if (!matchPost.getHostId().equals(raterId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Only host can rate players");
    }

    // Match must be finished
    if (!"FINISHED".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Can only rate players after match is finished");
    }

    // Ratee must be an approved participant
    Participant participant = participantRepository.findByMatchPostIdAndUserId(matchPostId, request.getRateeUserId())
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User is not a participant of this match"));

    if (!"APPROVED".equals(participant.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Can only rate approved participants");
    }

    // Check if rating already exists (allow update)
    PlayerRating rating = playerRatingRepository.findByMatchPostIdAndRateeId(matchPostId, request.getRateeUserId())
        .orElse(PlayerRating.builder()
            .matchPostId(matchPostId)
            .raterId(raterId)
            .rateeId(request.getRateeUserId())
            .build());

    boolean isNewRating = rating.getId() == null;

    rating.setStars(request.getStars());
    rating.setComment(request.getComment());

    rating = playerRatingRepository.save(rating);

    // Publish event (only for new ratings to avoid duplicate processing)
    if (isNewRating) {
      eventPublisher.publishRatingCreated(matchPostId, raterId, request.getRateeUserId(), request.getStars());
    }

    log.info("Player {} rated with {} stars for match {}", request.getRateeUserId(), request.getStars(), matchPostId);
    return toResponse(rating);
  }

  public List<PlayerRatingResponse> getRatingsForUser(UUID userId) {
    return playerRatingRepository.findByRateeIdOrderByCreatedAtDesc(userId)
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  public PlayerRatingResponse getRatingForMatch(UUID matchPostId, UUID rateeId) {
    PlayerRating rating = playerRatingRepository.findByMatchPostIdAndRateeId(matchPostId, rateeId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Rating not found"));
    return toResponse(rating);
  }

  private PlayerRatingResponse toResponse(PlayerRating rating) {
    return PlayerRatingResponse.builder()
        .id(rating.getId())
        .matchPostId(rating.getMatchPostId())
        .raterId(rating.getRaterId())
        .rateeId(rating.getRateeId())
        .stars(rating.getStars())
        .comment(rating.getComment())
        .createdAt(rating.getCreatedAt())
        .build();
  }
}
