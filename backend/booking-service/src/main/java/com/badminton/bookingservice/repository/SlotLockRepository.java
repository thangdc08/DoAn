package com.badminton.bookingservice.repository;

import com.badminton.bookingservice.entity.SlotLock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

public interface SlotLockRepository extends JpaRepository<SlotLock, UUID> {
    Optional<SlotLock> findByCourtIdAndStartTimeAndEndTimeAndStatus(UUID courtId, LocalDateTime startTime, LocalDateTime endTime, String status);
    List<SlotLock> findByCourtIdAndStatusAndExpiresAtAfterAndStartTimeGreaterThanEqualAndStartTimeLessThan(
            UUID courtId,
            String status,
            LocalDateTime now,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay);
    List<SlotLock> findByStatusAndExpiresAtBefore(String status, LocalDateTime now);
}
