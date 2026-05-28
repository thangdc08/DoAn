package com.badminton.communityservice.controller;

import com.badminton.communityservice.dto.*;
import com.badminton.communityservice.service.MatchPostService;
import com.badminton.communityservice.service.ParticipantService;
import com.badminton.communityservice.service.PlayerRatingService;
import com.badminton.communityservice.specification.MatchPostSpecification;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Arrays;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community/match-posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Community - Match Posts", description = "Endpoints for managing match posts (kèo)")
public class MatchPostController {

    private final MatchPostService matchPostService;
    private final ParticipantService participantService;
    private final PlayerRatingService playerRatingService;

    @PostMapping
    @Operation(summary = "Create match post", description = "Create a new match post (UC-E2.1)")
    public ApiResponse<MatchPostResponse> createMatchPost(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @Valid @RequestBody CreateMatchPostRequest request) {
        log.info("API Request: Create match post by user {}", userId);
        return ApiResponse.<MatchPostResponse>builder()
                .result(matchPostService.createMatchPost(userId, request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Search match posts", description = "Search and filter match posts (UC-E2.2)")
    public ApiResponse<Page<MatchPostResponse>> searchMatchPosts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String levels,
            @RequestParam(required = false) String joinMode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toTime,
            @RequestParam(required = false) UUID hostId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("API Request: Search match posts with filters");

        List<String> parsedLevels = levels == null || levels.isBlank()
                ? null
                : Arrays.stream(levels.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .collect(Collectors.toList());

        Specification<com.badminton.communityservice.entity.MatchPost> spec = Specification
                .where(MatchPostSpecification.titleContains(q))
                .and(MatchPostSpecification.hasStatus(status != null ? status : "OPEN"))
                .and(MatchPostSpecification.hasLevel(level))
                .and(MatchPostSpecification.hasAnyLevels(parsedLevels))
                .and(MatchPostSpecification.hasJoinMode(joinMode))
                .and(MatchPostSpecification.startTimeAfter(fromTime))
                .and(MatchPostSpecification.startTimeBefore(toTime))
                .and(MatchPostSpecification.hasHostId(hostId));

        return ApiResponse.<Page<MatchPostResponse>>builder()
                .result(matchPostService.searchMatchPosts(spec, pageable))
                .build();
    }

    @GetMapping("/my")
    @Operation(summary = "Get my matches", description = "Get matches created by current user")
    public ApiResponse<Page<MatchPostResponse>> getMyMatches(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("API Request: Get my matches for user {}", userId);
        Specification<com.badminton.communityservice.entity.MatchPost> spec = Specification
                .where(MatchPostSpecification.hasHostId(userId))
                .and(MatchPostSpecification.hasStatus(status));
        return ApiResponse.<Page<MatchPostResponse>>builder()
                .result(matchPostService.searchMatchPosts(spec, pageable))
                .build();
    }

    @GetMapping("/joined")
    @Operation(summary = "Get joined matches", description = "Get matches where user is host or approved participant")
    public ApiResponse<Page<MatchPostResponse>> getJoinedMatches(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("API Request: Get joined matches for user {}", userId);
        return ApiResponse.<Page<MatchPostResponse>>builder()
                .result(matchPostService.getJoinedMatches(userId, status, pageable))
                .build();
    }

    @GetMapping("/nearby")
    @Operation(summary = "Find nearby matches", description = "Find matches near a location using PostGIS")
    public ApiResponse<List<MatchPostResponse>> findNearbyMatches(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        log.info("API Request: Find nearby matches at ({}, {}) within {} km", lat, lng);
        return ApiResponse.<List<MatchPostResponse>>builder()
                .result(matchPostService.findNearbyMatches(lat, lng, radiusKm, limit))
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get match post details", description = "Get match post by ID (UC-E2.3)")
    public ApiResponse<MatchPostResponse> getMatchPost(@PathVariable UUID id) {
        log.info("API Request: Get match post {}", id);
        return ApiResponse.<MatchPostResponse>builder()
                .result(matchPostService.getMatchPostById(id))
                .build();
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Join match", description = "Request to join a match (UC-E2.5)")
    public ApiResponse<ParticipantResponse> joinMatch(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestHeader(value = "X-Auth-User-Name", defaultValue = "User") String userName,
            @RequestBody(required = false) JoinMatchRequest request) {
        log.info("API Request: User {} joining match {}", userId, id);
        if (request == null) {
            request = new JoinMatchRequest();
        }
        return ApiResponse.<ParticipantResponse>builder()
                .result(participantService.joinMatch(id, userId, userName, request))
                .build();
    }

    @PostMapping("/{id}/leave")
    @Operation(summary = "Leave match", description = "Leave a match (UC-F6)")
    public ApiResponse<Void> leaveMatch(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: User {} leaving match {}", userId, id);
        participantService.leaveMatch(id, userId);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/{id}/participants")
    @Operation(summary = "Get participants", description = "Get list of participants for a match")
    public ApiResponse<List<ParticipantResponse>> getParticipants(@PathVariable UUID id) {
        log.info("API Request: Get participants for match {}", id);
        return ApiResponse.<List<ParticipantResponse>>builder()
                .result(participantService.getParticipants(id))
                .build();
    }

    @PostMapping("/{id}/participants/{participantId}/approve")
    @Operation(summary = "Approve participant", description = "Host approves a participant (UC-E2.4)")
    public ApiResponse<ParticipantResponse> approveParticipant(
            @PathVariable UUID id,
            @PathVariable UUID participantId,
            @RequestHeader("X-Auth-User-Id") UUID hostId) {
        log.info("API Request: Host {} approving participant {} for match {}", hostId, participantId, id);
        return ApiResponse.<ParticipantResponse>builder()
                .result(participantService.approveParticipant(id, participantId, hostId))
                .build();
    }

    @PostMapping("/{id}/participants/{participantId}/reject")
    @Operation(summary = "Reject participant", description = "Host rejects a participant (UC-E2.4)")
    public ApiResponse<ParticipantResponse> rejectParticipant(
            @PathVariable UUID id,
            @PathVariable UUID participantId,
            @RequestHeader("X-Auth-User-Id") UUID hostId) {
        log.info("API Request: Host {} rejecting participant {} for match {}", hostId, participantId, id);
        return ApiResponse.<ParticipantResponse>builder()
                .result(participantService.rejectParticipant(id, participantId, hostId))
                .build();
    }

    @PostMapping("/{id}/close")
    @Operation(summary = "Close match", description = "Host closes match (UC-F7)")
    public ApiResponse<Void> closeMatch(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: User {} closing match {}", userId, id);
        matchPostService.closeMatchPost(id, userId);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/{id}/reopen")
    @Operation(summary = "Reopen match", description = "Host reopens the match (UC-F7)")
    public ApiResponse<Void> reopenMatch(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: User {} reopening match {}", userId, id);
        matchPostService.reopenMatchPost(id, userId);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/{id}/finish")
    @Operation(summary = "Finish match", description = "Host marks match as finished (UC-F8)")
    public ApiResponse<Void> finishMatch(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: User {} finishing match {}", userId, id);
        matchPostService.finishMatchPost(id, userId);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/{id}/ratings")
    @Operation(summary = "Rate player", description = "Rate player (UC-G2.1)")
    public ApiResponse<PlayerRatingResponse> ratePlayer(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @Valid @RequestBody CreatePlayerRatingRequest request) {
        log.info("API Request: User {} rating player {} for match {}", userId, request.getRateeUserId(), id);
        return ApiResponse.<PlayerRatingResponse>builder()
                .result(playerRatingService.ratePlayer(id, userId, request))
                .build();
    }

    @GetMapping("/{id}/ratings/{rateeId}")
    @Operation(summary = "Get rating for match", description = "Get rating for a specific player in a match")
    public ApiResponse<PlayerRatingResponse> getRatingForMatch(
            @PathVariable UUID id,
            @PathVariable UUID rateeId) {
        log.info("API Request: Get rating for match {}", id, rateeId);
        return ApiResponse.<PlayerRatingResponse>builder()
                .result(playerRatingService.getRatingForMatch(id, rateeId))
                .build();
    }
}