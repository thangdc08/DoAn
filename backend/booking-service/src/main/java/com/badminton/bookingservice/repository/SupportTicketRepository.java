package com.badminton.bookingservice.repository;

import com.badminton.bookingservice.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {

  Page<SupportTicket> findByUserId(UUID userId, Pageable pageable);

  Page<SupportTicket> findByUserIdAndStatus(UUID userId, String status, Pageable pageable);

  Page<SupportTicket> findByStatus(String status, Pageable pageable);

  Page<SupportTicket> findAll(Pageable pageable);
}
