package com.badminton.communityservice.specification;

import com.badminton.communityservice.entity.MatchPost;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public class MatchPostSpecification {

    public static Specification<MatchPost> hasStatus(String status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<MatchPost> hasLevel(String level) {
        return (root, query, cb) -> level == null ? null : cb.equal(root.get("level"), level);
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
}
