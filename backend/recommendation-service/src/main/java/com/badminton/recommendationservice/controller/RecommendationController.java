package com.badminton.recommendationservice.controller;

import com.badminton.recommendationservice.dto.MatchRecommendationResponse;
import com.badminton.recommendationservice.dto.VenueRecommendationResponse;
import com.badminton.recommendationservice.dto.WeatherRecommendationResponse;
import com.badminton.recommendationservice.service.RecommendationService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Recommendations", description = "Endpoints for getting personalized recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/venues")
    @Operation(summary = "Get venue recommendations", description = "Get personalized venue recommendations based on location and user history")
    public ApiResponse<List<VenueRecommendationResponse>> getVenueRecommendations(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(defaultValue = "10") int limit) {
        
        log.info("API Request: Get venue recommendations for user {} at ({}, {})", userId, lat, lng);
        return ApiResponse.<List<VenueRecommendationResponse>>builder()
                .result(recommendationService.recommendVenues(userId, lat, lng, radiusKm, limit))
                .build();
    }

    @GetMapping("/matches")
    @Operation(summary = "Get match recommendations", description = "Get personalized match recommendations based on location, level, and preferences")
    public ApiResponse<List<MatchRecommendationResponse>> getMatchRecommendations(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(defaultValue = "10") int limit) {
        
        log.info("API Request: Get match recommendations for user {} at ({}, {})", userId, lat, lng);
        return ApiResponse.<List<MatchRecommendationResponse>>builder()
                .result(recommendationService.recommendMatches(userId, lat, lng, radiusKm, limit))
                .build();
    }

    @GetMapping("/weather")
    @Operation(summary = "Get weather-aware play recommendation", description = "Get playability score and weather conditions based on coordinates")
    public ApiResponse<WeatherRecommendationResponse> getWeatherRecommendation(
            @RequestParam double lat,
            @RequestParam double lng) {
        
        log.info("API Request: Get weather recommendation for ({}, {})", lat, lng);
        return ApiResponse.<WeatherRecommendationResponse>builder()
                .result(recommendationService.getWeatherRecommendation(lat, lng))
                .build();
    }
}