package com.badminton.communityservice.specification;

import com.badminton.communityservice.entity.MatchPost;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.criteria.JoinType;

public class MatchPostSpecification {

    public static Specification<MatchPost> hasStatus(String status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<MatchPost> hasLevel(String level) {
        return (root, query, cb) -> level == null ? null : cb.equal(root.get("level"), level);
    }

    public static Specification<MatchPost> hasAnyLevels(List<String> levels) {
        return (root, query, cb) -> {
            if (levels == null || levels.isEmpty()) return null;
            query.distinct(true);
            var join = root.join("levels");
            return join.in(levels);
        };
    }

    public static Specification<MatchPost> hasJoinMode(String joinMode) {
        return (root, query, cb) -> joinMode == null ? null : cb.equal(root.get("joinMode"), joinMode);
    }

    public static Specification<MatchPost> titleContains(String keyword) {
        return (root, query, cb) -> keyword == null ? null : 
            cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<MatchPost> startTimeAfter(LocalDateTime fromTime) {
        return (root, query, cb) -> fromTime == null ? null : 
            cb.greaterThanOrEqualTo(root.get("startTime"), fromTime);
    }

    public static Specification<MatchPost> startTimeBefore(LocalDateTime toTime) {
        return (root, query, cb) -> toTime == null ? null : 
            cb.lessThanOrEqualTo(root.get("startTime"), toTime);
    }

    public static Specification<MatchPost> hasHostId(UUID hostId) {
        return (root, query, cb) -> hostId == null ? null : cb.equal(root.get("hostId"), hostId);
    }

    public static Specification<MatchPost> isHostOrParticipant(UUID userId) {
        return (root, query, cb) -> {
            if (userId == null) return null;

            var participants = root.join("participants", JoinType.LEFT);

            return cb.or(
                cb.equal(root.get("hostId"), userId),
                cb.equal(participants.get("userId"), userId)
            );
        };
    }
}
