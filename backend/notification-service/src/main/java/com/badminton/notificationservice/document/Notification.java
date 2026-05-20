package com.badminton.notificationservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Document(collection = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    private String id;

    @Indexed
    private UUID receiverId;

    private String type;
    private String title;
    private String content;

    private Map<String, Object> data;

    private LocalDateTime readAt;

    @Indexed
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
