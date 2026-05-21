package com.badminton.identityservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.request.UpdateUserStatusRequest;
import com.badminton.identityservice.dto.request.UpdateUserRolesRequest;
import com.badminton.identityservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin - User Management", description = "Admin endpoints for managing users")
public class AdminController {

    private final UserService userService;

    @ApiMessage("Lấy danh sách người dùng")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users", description = "Admin gets paginated list of all users with filters")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsersForAdmin(status, role, search, pageable));
    }

    @ApiMessage("Cập nhật trạng thái người dùng")
    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user status", description = "Admin updates user status (ACTIVE/LOCKED)")
    public ResponseEntity<UserDTO> updateUserStatus(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(userService.updateUserStatus(userId, request));
    }

    @ApiMessage("Cập nhật vai trò người dùng")
    @PatchMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user roles", description = "Admin updates user roles")
    public ResponseEntity<UserDTO> updateUserRoles(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRolesRequest request) {
        return ResponseEntity.ok(userService.updateUserRoles(userId, request));
    }

    @ApiMessage("Xóa người dùng")
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user", description = "Admin deletes a user (soft delete)")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}