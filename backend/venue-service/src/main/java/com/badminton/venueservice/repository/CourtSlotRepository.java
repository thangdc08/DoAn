package com.badminton.venueservice.repository;

import com.badminton.venueservice.entity.CourtSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface CourtSlotRepository extends JpaRepository<CourtSlot, UUID> {
    List<CourtSlot> findByCourtIdAndSlotDate(UUID courtId, LocalDate slotDate);
    List<CourtSlot> findByCourtIdAndSlotDateBetween(UUID courtId, LocalDate startDate, LocalDate endDate);
    void deleteByCourtIdAndSlotDateBetween(UUID courtId, LocalDate startDate, LocalDate endDate);
}
