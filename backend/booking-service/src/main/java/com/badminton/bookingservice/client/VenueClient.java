package com.badminton.bookingservice.client;

import com.badminton.bookingservice.dto.VenueInternalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import com.badminton.common.dto.ApiResponse;
import com.badminton.bookingservice.dto.VenueInternalResponse;

@FeignClient(name = "venue-service", url = "${app.services.venue-service.url}")
public interface VenueClient {

  @GetMapping("/internal/venues/{id}")
  VenueInternalResponse getVenueById(@PathVariable("id") UUID id);

  @GetMapping("/internal/courts/{courtId}/price")
  BigDecimal getPrice(
      @PathVariable("courtId") UUID courtId,
      @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
      @RequestParam("endTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime);

  @GetMapping("/api/venues/owner/{ownerId}")
  ApiResponse<List<VenueInternalResponse>> getVenuesByOwner(@PathVariable("ownerId") UUID ownerId);
}
