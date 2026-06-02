package com.badminton.communityservice.scheduler;

import com.badminton.communityservice.entity.MatchPost;
import com.badminton.communityservice.repository.MatchPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MatchPostCleanupScheduler {

    private final MatchPostRepository matchPostRepository;

    @Scheduled(cron = "0 * * * * *") // Chạy mỗi phút
    @Transactional
    public void cleanupExpiredMatches() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Running match post cleanup scheduler at {}", now);

        closeExpiredMatches(now);
        finishExpiredMatches(now);
    }

    /**
     * Tự động đóng các kèo đang OPEN khi trận đấu bắt đầu.
     */
    private void closeExpiredMatches(LocalDateTime now) {
        List<MatchPost> expiredOpenMatches = matchPostRepository.findByStatusAndStartTimeBefore("OPEN", now);
        if (!expiredOpenMatches.isEmpty()) {
            log.info("Found {} expired OPEN matches to close", expiredOpenMatches.size());
            for (MatchPost match : expiredOpenMatches) {
                match.setStatus("CLOSED");
                matchPostRepository.save(match);
                log.info("Match id {} automatically CLOSED because startTime has passed", match.getId());
            }
        }
    }

    /**
     * Tự động hoàn thành các kèo đang OPEN/CLOSED khi trận đấu kết thúc.
     */
    private void finishExpiredMatches(LocalDateTime now) {
        List<String> activeStatuses = Arrays.asList("OPEN", "CLOSED");
        List<MatchPost> expiredFinishedMatches = matchPostRepository.findByStatusInAndEndTimeBefore(activeStatuses, now);
        if (!expiredFinishedMatches.isEmpty()) {
            log.info("Found {} active matches to mark as FINISHED", expiredFinishedMatches.size());
            for (MatchPost match : expiredFinishedMatches) {
                match.setStatus("FINISHED");
                matchPostRepository.save(match);
                log.info("Match id {} automatically marked as FINISHED because endTime has passed", match.getId());
            }
        }
    }
}
