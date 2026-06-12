package com.badminton.bookingservice.scheduler;

import com.badminton.bookingservice.client.VenueClient;
import com.badminton.bookingservice.dto.VenueInternalResponse;
import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.service.BookingEventPublisher;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingReminderScheduler {

    private final BookingRepository bookingRepository;
    private final VenueClient venueClient;
    private final BookingEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    @Value("${app.default.owner-confirm-reminder-minutes:15}")
    private int defaultOwnerConfirmReminderMinutes;

    @Value("${app.default.player-playtime-reminder-hours:2}")
    private int defaultPlayerPlaytimeReminderHours;

    @Scheduled(cron = "0 * * * * *") // Runs every minute
    @Transactional
    public void runReminders() {
        log.info("Running Booking Reminder Scheduler...");
        remindOwnersToConfirm();
        remindPlayersOfUpcomingPlaytime();
    }

    private void remindOwnersToConfirm() {
        List<Booking> pendingBookings = bookingRepository.findByStatusAndOwnerReminderSent("PAID", false);
        if (pendingBookings.isEmpty()) {
            return;
        }

        log.info("Found {} PAID bookings awaiting owner confirmation", pendingBookings.size());
        LocalDateTime now = LocalDateTime.now();

        for (Booking booking : pendingBookings) {
            int reminderWindowMinutes = defaultOwnerConfirmReminderMinutes;
            VenueInternalResponse venue = null;
            try {
                venue = venueClient.getVenueById(booking.getVenueId());
                if (venue != null && venue.getPolicy() != null && !venue.getPolicy().trim().isEmpty()) {
                    JsonNode policyRoot = objectMapper.readTree(venue.getPolicy());
                    JsonNode bp = policyRoot.path("bookingPolicy");
                    if (bp.has("ownerConfirmReminderWindow")) {
                        reminderWindowMinutes = bp.get("ownerConfirmReminderWindow").asInt();
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to read owner confirm reminder window for booking {}, using default: {}", 
                        booking.getId(), e.getMessage());
            }

            LocalDateTime paidAt = booking.getPaidAt();
            if (paidAt == null) {
                paidAt = booking.getCreatedAt();
            }

            if (paidAt.plusMinutes(reminderWindowMinutes).isBefore(now)) {
                log.info("Triggering owner confirmation reminder for booking {}", booking.getId());
                
                eventPublisher.publishBookingOwnerReminder(BookingEventPublisher.BookingOwnerReminderEvent.builder()
                        .bookingId(booking.getId())
                        .ownerId(venue != null ? venue.getOwnerId() : null)
                        .venueName(booking.getVenueNameSnapshot())
                        .paidAt(paidAt)
                        .build());

                booking.setOwnerReminderSent(true);
                bookingRepository.save(booking);
            }
        }
    }

    private void remindPlayersOfUpcomingPlaytime() {
        LocalDateTime now = LocalDateTime.now();
        // Look up to 12 hours ahead to find matching player reminders
        LocalDateTime lookAheadTime = now.plusHours(12);
        List<Booking> confirmedBookings = bookingRepository.findByStatusAndStartTimeBetweenAndPlayerReminderSent(
                "CONFIRMED", now, lookAheadTime, false);

        if (confirmedBookings.isEmpty()) {
            return;
        }

        log.info("Found {} CONFIRMED bookings to check for player playtime reminders", confirmedBookings.size());

        for (Booking booking : confirmedBookings) {
            int reminderWindowHours = defaultPlayerPlaytimeReminderHours;
            try {
                VenueInternalResponse venue = venueClient.getVenueById(booking.getVenueId());
                if (venue != null && venue.getPolicy() != null && !venue.getPolicy().trim().isEmpty()) {
                    JsonNode policyRoot = objectMapper.readTree(venue.getPolicy());
                    JsonNode bp = policyRoot.path("bookingPolicy");
                    if (bp.has("playerPlaytimeReminderWindow")) {
                        reminderWindowHours = bp.get("playerPlaytimeReminderWindow").asInt();
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to read player playtime reminder window for booking {}, using default: {}", 
                        booking.getId(), e.getMessage());
            }

            if (booking.getStartTime().isBefore(now.plusHours(reminderWindowHours))) {
                log.info("Triggering player playtime reminder for booking {}", booking.getId());

                eventPublisher.publishBookingPlayerReminder(BookingEventPublisher.BookingPlayerReminderEvent.builder()
                        .bookingId(booking.getId())
                        .userId(booking.getUserId())
                        .venueName(booking.getVenueNameSnapshot())
                        .startTime(booking.getStartTime())
                        .build());

                booking.setPlayerReminderSent(true);
                bookingRepository.save(booking);
            }
        }
    }
}
