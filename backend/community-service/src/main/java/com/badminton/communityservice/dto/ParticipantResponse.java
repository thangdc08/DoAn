package com.badminton.communityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantResponse {
    private UUID id;
    private UUID matchPostId;
    private UUID userId;
    private String userFullName;
    private String status; // PENDING | APPROVED | REJECTED | CANCELLED_BY_USER | REMOVED_BY_HOST
    private LocalDateTime joinedAt;
}
