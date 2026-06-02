package com.badminton.communityservice.scheduler;

import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.repository.MatchPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class MatchPostCleanupSchedulerTest {

    @Mock
    private MatchPostRepository matchPostRepository;

    @InjectMocks
    private MatchPostCleanupScheduler matchPostCleanupScheduler;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCleanupExpiredMatches_CloseMatches() {
        MatchPost match = MatchPost.builder()
                .id(UUID.randomUUID())
                .status("OPEN")
                .startTime(LocalDateTime.now().minusMinutes(5))
                .endTime(LocalDateTime.now().plusHours(1))
                .build();

        when(matchPostRepository.findByStatusAndStartTimeBefore(eq("OPEN"), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(match));
        when(matchPostRepository.findByStatusInAndEndTimeBefore(any(List.class), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

        matchPostCleanupScheduler.cleanupExpiredMatches();

        ArgumentCaptor<MatchPost> captor = ArgumentCaptor.forClass(MatchPost.class);
        verify(matchPostRepository).save(captor.capture());
        assertEquals("CLOSED", captor.getValue().getStatus());
    }

    @Test
    public void testCleanupExpiredMatches_FinishMatches() {
        MatchPost match = MatchPost.builder()
                .id(UUID.randomUUID())
                .status("CLOSED")
                .startTime(LocalDateTime.now().minusHours(2))
                .endTime(LocalDateTime.now().minusMinutes(10))
                .build();

        when(matchPostRepository.findByStatusAndStartTimeBefore(eq("OPEN"), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());
        when(matchPostRepository.findByStatusInAndEndTimeBefore(any(List.class), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(match));

        matchPostCleanupScheduler.cleanupExpiredMatches();

        ArgumentCaptor<MatchPost> captor = ArgumentCaptor.forClass(MatchPost.class);
        verify(matchPostRepository).save(captor.capture());
        assertEquals("FINISHED", captor.getValue().getStatus());
    }
}
