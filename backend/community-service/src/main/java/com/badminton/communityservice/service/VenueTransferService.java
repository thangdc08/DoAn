package com.badminton.communityservice.service;

import com.badminton.communityservice.dto.CreateVenueTransferRequest;
import com.badminton.communityservice.dto.VenueTransferResponse;
import com.badminton.communityservice.entity.VenueTransfer;
import com.badminton.communityservice.repository.VenueTransferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueTransferService {

    private final VenueTransferRepository venueTransferRepository;

    @Transactional
    public VenueTransferResponse createVenueTransfer(UUID sellerId, CreateVenueTransferRequest request) {
        log.info("Creating venue transfer for seller {} at venue {}", sellerId, request.getVenueName());
        
        VenueTransfer transfer = VenueTransfer.builder()
                .sellerId(sellerId)
                .venueName(request.getVenueName())
                .courtName(request.getCourtName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .originalPrice(request.getOriginalPrice())
                .transferPrice(request.getTransferPrice())
                .contactPhone(request.getContactPhone())
                .note(request.getNote())
                .bookingId(request.getBookingId())
                .status("OPEN")
                .build();

        VenueTransfer saved = venueTransferRepository.save(transfer);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VenueTransferResponse> getVenueTransfers(String status) {
        log.info("Fetching venue transfers with status {}", status);
        List<VenueTransfer> transfers;
        if (status == null || status.isBlank()) {
            transfers = venueTransferRepository.findAll();
        } else {
            transfers = venueTransferRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        
        return transfers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VenueTransferResponse claimVenueTransfer(UUID buyerId, UUID id) {
        log.info("Claiming venue transfer {} by buyer {}", id, buyerId);
        VenueTransfer transfer = venueTransferRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venue transfer post not found"));

        if (!"OPEN".equals(transfer.getStatus())) {
            throw new IllegalStateException("Venue transfer post is not open for transfer");
        }

        if (transfer.getSellerId().equals(buyerId)) {
            throw new IllegalArgumentException("You cannot claim your own venue transfer post");
        }

        transfer.setBuyerId(buyerId);
        transfer.setStatus("COMPLETED");
        
        VenueTransfer updated = venueTransferRepository.save(transfer);
        return mapToResponse(updated);
    }

    @Transactional
    public void cancelVenueTransfer(UUID sellerId, UUID id) {
        log.info("Cancelling venue transfer {} by seller {}", id, sellerId);
        VenueTransfer transfer = venueTransferRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venue transfer post not found"));

        if (!transfer.getSellerId().equals(sellerId)) {
            throw new IllegalStateException("Only the seller can cancel this transfer post");
        }

        if (!"OPEN".equals(transfer.getStatus())) {
            throw new IllegalStateException("Only open transfers can be cancelled");
        }

        transfer.setStatus("CANCELLED");
        venueTransferRepository.save(transfer);
    }

    private VenueTransferResponse mapToResponse(VenueTransfer transfer) {
        return VenueTransferResponse.builder()
                .id(transfer.getId())
                .sellerId(transfer.getSellerId())
                .buyerId(transfer.getBuyerId())
                .venueName(transfer.getVenueName())
                .courtName(transfer.getCourtName())
                .startTime(transfer.getStartTime())
                .endTime(transfer.getEndTime())
                .originalPrice(transfer.getOriginalPrice())
                .transferPrice(transfer.getTransferPrice())
                .status(transfer.getStatus())
                .contactPhone(transfer.getContactPhone())
                .note(transfer.getNote())
                .bookingId(transfer.getBookingId())
                .createdAt(transfer.getCreatedAt())
                .updatedAt(transfer.getUpdatedAt())
                .build();
    }
}
