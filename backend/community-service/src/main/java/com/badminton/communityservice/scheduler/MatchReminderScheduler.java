package com.badminton.communityservice.scheduler;

import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.entity.Participant;
import com.badminton.communityservice.repository.MatchPostRepository;
import com.badminton.communityservice.repository.ParticipantRepository;
import com.badminton.communityservice.service.CommunityEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class MatchReminderScheduler {

    private final MatchPostRepository matchPostRepository;
    private final ParticipantRepository participantRepository;
    private final CommunityEventPublisher eventPublisher;

    @Scheduled(cron = "0 * * * * *") // Runs every minute
    @Transactional
    public void remindMatchParticipants() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lookAheadTime = now.plusHours(2);
        
        List<MatchPost> upcomingMatches = matchPostRepository.findByStatusInAndStartTimeBetweenAndReminderSent(
                Arrays.asList("OPEN", "CLOSED"), now, lookAheadTime, false);

        if (upcomingMatches.isEmpty()) {
            return;
        }

        log.info("Found {} upcoming matches for playtime reminders", upcomingMatches.size());

        for (MatchPost match : upcomingMatches) {
            log.info("Processing match reminder for: {}", match.getTitle());

            // Collect all user IDs who are approved
            List<Participant> participants = participantRepository.findByMatchPostIdAndStatus(match.getId(), "APPROVED");
            List<UUID> userIds = participants.stream()
                    .map(Participant::getUserId)
                    .collect(Collectors.toList());

            // Add the host to the list if not already present
            if (!userIds.contains(match.getHostId())) {
                userIds.add(match.getHostId());
            }

            // Publish event
            eventPublisher.publishMatchPlaytimeReminder(
                    match.getId(),
                    userIds,
                    match.getTitle(),
                    match.getStartTime(),
                    match.getVenueName() != null ? match.getVenueName() : "Sân đấu giao lưu"
            );

            // Mark as sent
            match.setReminderSent(true);
            matchPostRepository.save(match);
        }
    }
}
