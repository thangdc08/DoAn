package com.badminton.venueservice.repository;

import com.badminton.venueservice.entity.PriceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PriceRuleRepository extends JpaRepository<PriceRule, UUID> {
    List<PriceRule> findByVenueId(UUID venueId);
    List<PriceRule> findByCourtId(UUID courtId);
    List<PriceRule> findByVenueIdAndDayOfWeek(UUID venueId, Integer dayOfWeek);
    void deleteByCourtId(UUID courtId);
}
