package com.badminton.communityservice.service;

import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.entity.Participant;
import com.badminton.communityservice.repository.MatchPostRepository;
import com.badminton.communityservice.repository.ParticipantRepository;
import com.badminton.common.exception.AppException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class MatchPostServiceTest {

    @Mock
    private MatchPostRepository matchPostRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private CommunityEventPublisher eventPublisher;

    @InjectMocks
    private MatchPostService matchPostService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(matchPostService, "cancelBeforeHours", 2);
    }

    @Test
    public void testCancelMatchPost_Success() {
        UUID matchId = UUID.randomUUID();
        UUID hostId = UUID.randomUUID();

        MatchPost matchPost = MatchPost.builder()
                .id(matchId)
                .hostId(hostId)
                .status("OPEN")
                .startTime(LocalDateTime.now().plusHours(3)) // 3 hours (> 2)
                .build();

        Participant participant = Participant.builder()
                .id(UUID.randomUUID())
                .matchPostId(matchId)
                .status("APPROVED")
                .build();

        when(matchPostRepository.findById(matchId)).thenReturn(Optional.of(matchPost));
        when(participantRepository.findByMatchPostIdOrderByJoinedAtAsc(matchId))
                .thenReturn(Collections.singletonList(participant));

        matchPostService.cancelMatchPost(matchId, hostId);

        assertEquals("CANCELLED_BY_USER", matchPost.getStatus());
        assertEquals("CANCELLED_BY_USER", participant.getStatus());
        verify(matchPostRepository).save(matchPost);
        verify(participantRepository).save(participant);
    }

    @Test
    public void testCancelMatchPost_TooLate_ThrowsException() {
        UUID matchId = UUID.randomUUID();
        UUID hostId = UUID.randomUUID();

        MatchPost matchPost = MatchPost.builder()
                .id(matchId)
                .hostId(hostId)
                .status("OPEN")
                .startTime(LocalDateTime.now().plusHours(1)) // 1 hour (< 2)
                .build();

        when(matchPostRepository.findById(matchId)).thenReturn(Optional.of(matchPost));

        AppException exception = assertThrows(AppException.class, () -> {
            matchPostService.cancelMatchPost(matchId, hostId);
        });

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Không thể hủy kèo đấu trước giờ bắt đầu dưới 2 giờ", exception.getMessage());
        verify(matchPostRepository, never()).save(any());
    }
}
