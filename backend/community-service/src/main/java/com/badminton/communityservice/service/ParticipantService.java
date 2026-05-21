package com.badminton.communityservice.service;

import com.badminton.communityservice.dto.JoinMatchRequest;
import com.badminton.communityservice.dto.ParticipantResponse;
import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.entity.Participant;
import com.badminton.communityservice.repository.MatchPostRepository;
import com.badminton.communityservice.repository.ParticipantRepository;
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
public class ParticipantService {

  private final ParticipantRepository participantRepository;
  private final MatchPostRepository matchPostRepository;
  private final CommunityEventPublisher eventPublisher;

  @Transactional
  public ParticipantResponse joinMatch(UUID matchPostId, UUID userId, String userFullName, JoinMatchRequest request) {
    log.info("User {} attempting to join match {}", userId, matchPostId);

    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    // Validations
    if (!"OPEN".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Match is not open for joining");
    }

    if (matchPost.getHostId().equals(userId)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Host cannot join their own match");
    }

    // Check if already joined
    if (participantRepository.existsByMatchPostIdAndUserId(matchPostId, userId)) {
      Participant existing = participantRepository.findByMatchPostIdAndUserId(matchPostId, userId)
          .orElseThrow();
      log.info("User {} already joined match {}, returning existing participant", userId, matchPostId);
      return toResponse(existing);
    }

    // Check capacity
    int approvedCount = participantRepository.countByMatchPostIdAndStatus(matchPostId, "APPROVED");
    if (approvedCount >= matchPost.getMaxParticipants() - 1) { // -1 for host
      throw new AppException(HttpStatus.CONFLICT, "Match has reached maximum participants");
    }

    // Determine initial status based on join mode
    String initialStatus = "OPEN".equals(matchPost.getJoinMode()) ? "APPROVED" : "PENDING";

    Participant participant = Participant.builder()
        .matchPostId(matchPostId)
        .userId(userId)
        .userFullName(userFullName)
        .status(initialStatus)
        .build();

    participant = participantRepository.save(participant);

    // Update current participants count if approved
    if ("APPROVED".equals(initialStatus)) {
      matchPost.setCurrentParticipants(matchPost.getCurrentParticipants() + 1);
      matchPostRepository.save(matchPost);

      // Publish MatchApproved event
      eventPublisher.publishMatchApproved(matchPostId, userId, matchPost.getHostId());
    } else {
      // Publish MatchJoinRequested event
      eventPublisher.publishMatchJoinRequested(matchPostId, userId, matchPost.getHostId());
    }

    log.info("User {} joined match {} with status {}", userId, matchPostId, initialStatus);
    return toResponse(participant);
  }

  @Transactional
  public ParticipantResponse approveParticipant(UUID matchPostId, UUID participantId, UUID hostId) {
    log.info("Host {} approving participant {} for match {}", hostId, participantId, matchPostId);

    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    if (!matchPost.getHostId().equals(hostId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Only host can approve participants");
    }

    if (!"OPEN".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Match is not open");
    }

    Participant participant = participantRepository.findById(participantId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Participant not found"));

    if (!participant.getMatchPostId().equals(matchPostId)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Participant does not belong to this match");
    }

    if (!"PENDING".equals(participant.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Participant is not pending");
    }

    // Check capacity
    int approvedCount = participantRepository.countByMatchPostIdAndStatus(matchPostId, "APPROVED");
    if (approvedCount >= matchPost.getMaxParticipants() - 1) {
      throw new AppException(HttpStatus.CONFLICT, "Match has reached maximum participants");
    }

    participant.setStatus("APPROVED");
    participant = participantRepository.save(participant);

    // Update current participants count
    matchPost.setCurrentParticipants(matchPost.getCurrentParticipants() + 1);

    // Auto-close if full
    if (matchPost.getCurrentParticipants() >= matchPost.getMaxParticipants()) {
      matchPost.setStatus("CLOSED");
      log.info("Match {} auto-closed (full capacity)", matchPostId);
    }

    matchPostRepository.save(matchPost);

    // Publish event
    eventPublisher.publishMatchApproved(matchPostId, participant.getUserId(), hostId);

    log.info("Participant {} approved for match {}", participantId, matchPostId);
    return toResponse(participant);
  }

  @Transactional
  public ParticipantResponse rejectParticipant(UUID matchPostId, UUID participantId, UUID hostId) {
    log.info("Host {} rejecting participant {} for match {}", hostId, participantId, matchPostId);

    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    if (!matchPost.getHostId().equals(hostId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Only host can reject participants");
    }

    Participant participant = participantRepository.findById(participantId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Participant not found"));

    if (!participant.getMatchPostId().equals(matchPostId)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Participant does not belong to this match");
    }

    if (!"PENDING".equals(participant.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Participant is not pending");
    }

    participant.setStatus("REJECTED");
    participant = participantRepository.save(participant);

    log.info("Participant {} rejected for match {}", participantId, matchPostId);
    return toResponse(participant);
  }

  @Transactional
  public void leaveMatch(UUID matchPostId, UUID userId) {
    log.info("User {} leaving match {}", userId, matchPostId);

    MatchPost matchPost = matchPostRepository.findById(matchPostId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Match post not found"));

    if ("FINISHED".equals(matchPost.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Cannot leave a finished match");
    }

    Participant participant = participantRepository.findByMatchPostIdAndUserId(matchPostId, userId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "You are not a participant of this match"));

    if (!"PENDING".equals(participant.getStatus()) && !"APPROVED".equals(participant.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Cannot leave match with current status");
    }

    boolean wasApproved = "APPROVED".equals(participant.getStatus());

    participant.setStatus("CANCELLED_BY_USER");
    participantRepository.save(participant);

    // Update current participants count if was approved
    if (wasApproved) {
      matchPost.setCurrentParticipants(Math.max(1, matchPost.getCurrentParticipants() - 1));

      // Reopen if was closed due to capacity
      if ("CLOSED".equals(matchPost.getStatus()) &&
          matchPost.getCurrentParticipants() < matchPost.getMaxParticipants()) {
        matchPost.setStatus("OPEN");
        log.info("Match {} reopened after participant left", matchPostId);
      }

      matchPostRepository.save(matchPost);
    }

    log.info("User {} left match {}", userId, matchPostId);
  }

  public List<ParticipantResponse> getParticipants(UUID matchPostId) {
    return participantRepository.findByMatchPostIdOrderByJoinedAtAsc(matchPostId)
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  private ParticipantResponse toResponse(Participant participant) {
    return ParticipantResponse.builder()
        .id(participant.getId())
        .matchPostId(participant.getMatchPostId())
        .userId(participant.getUserId())
        .userFullName(participant.getUserFullName())
        .status(participant.getStatus())
        .joinedAt(participant.getJoinedAt())
        .build();
  }
}
