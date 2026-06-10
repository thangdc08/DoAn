package com.badminton.identityservice.controller;

import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.repository.RoleRepository;
import com.badminton.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/internal/staff")
@RequiredArgsConstructor
@Slf4j
public class InternalStaffController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @PostMapping("/sync")
    @Transactional
    public ResponseEntity<Map<String, Object>> syncStaffRoles(@RequestBody SyncStaffRequest request) {
        log.info("Syncing staff roles for venue {} with {} staff members", request.getVenueId(), request.getStaffEmails().size());

        Role staffRole = roleRepository.findByCode("STAFF")
                .orElseThrow(() -> new RuntimeException("STAFF role not found. Please run DataSeeder."));

        Set<String> newStaffEmails = new HashSet<>(request.getStaffEmails());

        // Find all users currently having STAFF role
        List<User> allStaffUsers = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> "STAFF".equals(r.getCode())))
                .collect(Collectors.toList());

        // Remove STAFF role from users no longer in the staff list
        for (User staffUser : allStaffUsers) {
            if (staffUser.getEmail() == null) continue;
            if (!newStaffEmails.contains(staffUser.getEmail())) {
                staffUser.getRoles().removeIf(r -> "STAFF".equals(r.getCode()));
                userRepository.save(staffUser);
                log.info("Removed STAFF role from user {} (email: {})", staffUser.getId(), staffUser.getEmail());
            }
        }

        // Add STAFF role to new staff members
        int addedCount = 0;
        for (String email : newStaffEmails) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                boolean hasStaffRole = user.getRoles().stream().anyMatch(r -> "STAFF".equals(r.getCode()));
                if (!hasStaffRole) {
                    user.getRoles().add(staffRole);
                    userRepository.save(user);
                    addedCount++;
                    log.info("Added STAFF role to user {} (email: {})", user.getId(), email);
                }
            } else {
                log.warn("Staff user not found with email: {}", email);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("venueId", request.getVenueId());
        result.put("totalStaff", newStaffEmails.size());
        result.put("addedCount", addedCount);
        result.put("message", "Staff roles synced successfully");

        return ResponseEntity.ok(result);
    }

    public static class SyncStaffRequest {
        private UUID venueId;
        private List<String> staffEmails = new ArrayList<>();

        public UUID getVenueId() { return venueId; }
        public void setVenueId(UUID venueId) { this.venueId = venueId; }
        public List<String> getStaffEmails() { return staffEmails; }
        public void setStaffEmails(List<String> staffEmails) { this.staffEmails = staffEmails; }
    }
}
