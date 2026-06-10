package com.badminton.identityservice.client;

import com.badminton.common.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Map;

@FeignClient(name = "venue-service", url = "${app.services.venue-service-url:http://localhost:8082}")
public interface VenueClient {

  @GetMapping("/api/venues/owner/{ownerId}")
  ApiResponse<List<Map<String, Object>>> getVenuesByOwner(
      @PathVariable String ownerId,
      @RequestHeader(value = "X-Auth-User-Id", required = false) String userId);
}
