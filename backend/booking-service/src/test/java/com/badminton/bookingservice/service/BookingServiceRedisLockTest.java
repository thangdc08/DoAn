package com.badminton.bookingservice.service;

import com.badminton.bookingservice.entity.SlotLock;
import com.badminton.bookingservice.repository.BookingItemRepository;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.repository.SlotLockRepository;
import com.badminton.common.exception.AppException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class BookingServiceRedisLockTest {

    @Mock
    private SlotLockRepository slotLockRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingItemRepository bookingItemRepository;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    public void testLockSlot_Success() {
        UUID userId = UUID.randomUUID();
        UUID venueId = UUID.randomUUID();
        UUID courtId = UUID.randomUUID();
        LocalDateTime startTime = LocalDateTime.now().plusHours(1);
        LocalDateTime endTime = LocalDateTime.now().plusHours(2);

        // Mock lock acquisition succeeds in Redis
        when(valueOperations.setIfAbsent(anyString(), eq(userId.toString()), any()))
                .thenReturn(true);

        // Mock DB availability check passes (empty optional)
        when(slotLockRepository.findByCourtIdAndStartTimeAndEndTimeAndStatus(eq(courtId), eq(startTime), eq(endTime), eq("LOCKED")))
                .thenReturn(Optional.empty());

        SlotLock mockSavedLock = SlotLock.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .venueId(venueId)
                .courtId(courtId)
                .startTime(startTime)
                .endTime(endTime)
                .status("LOCKED")
                .build();

        when(slotLockRepository.save(any(SlotLock.class))).thenReturn(mockSavedLock);

        SlotLock result = bookingService.lockSlot(userId, venueId, courtId, startTime, endTime);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals("LOCKED", result.getStatus());

        verify(valueOperations).setIfAbsent(anyString(), eq(userId.toString()), any());
        verify(slotLockRepository).save(any(SlotLock.class));
    }

    @Test
    public void testLockSlot_Conflict_RedisLockAcquisitionFailed() {
        UUID userId = UUID.randomUUID();
        UUID venueId = UUID.randomUUID();
        UUID courtId = UUID.randomUUID();
        LocalDateTime startTime = LocalDateTime.now().plusHours(1);
        LocalDateTime endTime = LocalDateTime.now().plusHours(2);

        // Mock lock acquisition fails in Redis
        when(valueOperations.setIfAbsent(anyString(), eq(userId.toString()), any()))
                .thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> {
            bookingService.lockSlot(userId, venueId, courtId, startTime, endTime);
        });

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
        assertEquals("Khung giờ này đang được xử lý hoặc giữ chỗ bởi người dùng khác", exception.getMessage());

        verify(valueOperations).setIfAbsent(anyString(), eq(userId.toString()), any());
        verify(slotLockRepository, never()).save(any(SlotLock.class));
    }
}
