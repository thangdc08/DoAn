package com.badminton.notificationservice.repository;

import com.badminton.notificationservice.document.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByReceiverIdOrderByCreatedAtDesc(UUID receiverId);
    long countByReceiverIdAndReadAtIsNull(UUID receiverId);
}
