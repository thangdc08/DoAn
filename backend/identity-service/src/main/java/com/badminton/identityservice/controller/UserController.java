package com.badminton.identityservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.identityservice.dto.message.ObjectResponse;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.model.UserUpdateDTO;
import com.badminton.identityservice.dto.request.UpdateLocationRequest;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.service.UserService;
import com.badminton.identityservice.utils.CustomHeaders;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final com.badminton.identityservice.service.FileService fileService;

    @PostMapping("/avatar")
    @ApiMessage("Tải ảnh đại diện lên")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        return ResponseEntity.ok(this.fileService.uploadAvatar(file));
    }

    @GetMapping("/files/avatars/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getAvatar(@PathVariable String fileName) throws java.io.IOException {
        java.nio.file.Path path = java.nio.file.Paths.get("uploads/avatars").resolve(fileName);
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                .body(resource);
    }

    @PostMapping
    @ApiMessage("Tạo người dùng mới")
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserDTO userDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.createUser(userDTO));
    }

    @GetMapping
    @ApiMessage("Lấy danh sách người dùng")
    public ResponseEntity<ObjectResponse> getAllUser(
            @Filter Specification<User> specification, Pageable pageable){
        return ResponseEntity.ok(this.userService.getAllUser(specification, pageable));
    }

    @GetMapping("/{userId}")
    @ApiMessage("Lấy thông tin người dùng theo ID")
    public ResponseEntity<UserDTO> getUserById(@PathVariable(value = "userId") UUID id) {
        return ResponseEntity.ok(this.userService.getUserById(id));
    }

    @GetMapping("/{userId}/email")
    @ApiMessage("Lấy email người dùng theo ID (internal)")
    public ResponseEntity<Map<String, String>> getUserEmail(@PathVariable(value = "userId") UUID id) {
        UserDTO user = this.userService.getUserById(id);
        return ResponseEntity.ok(Map.of("email", user.getEmail()));
    }

    @PutMapping("/{userId}")
    @ApiMessage("Cập nhật thông tin người dùng")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable(value = "userId") UUID id,
            @RequestBody UserUpdateDTO userDto) {
        return ResponseEntity.ok(this.userService.updateUser(userDto, id));
    }

    @DeleteMapping("/{userId}")
    @ApiMessage("Xóa người dùng")
    public ResponseEntity<Void> deleteUser(@PathVariable(value = "userId") UUID id) {
        this.userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @ApiMessage("Lấy thông tin cá nhân")
    public ResponseEntity<UserDTO> getMe(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID id,
            @RequestHeader(value = CustomHeaders.X_AUTH_USER_AUTHORITIES, required = false) String authorities) {
        UserDTO userDTO = this.userService.getUserProfile(id);
        if (authorities != null && !authorities.isBlank()) {
            Set<String> extraRoles = new java.util.LinkedHashSet<>();
            for (String scope : authorities.split(" ")) {
                String role = scope.replace("SCOPE_", "");
                if (!role.equals("USER")) {
                    extraRoles.add(role);
                }
            }
            if (!extraRoles.isEmpty()) {
                Set<String> roles = new java.util.LinkedHashSet<>(userDTO.getRoles());
                roles.addAll(extraRoles);
                userDTO.setRoles(roles);
            }
        }
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/me")
    @ApiMessage("Cập nhật thông tin cá nhân")
    public ResponseEntity<UserDTO> updateMe(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID id,
            @RequestBody @Valid com.badminton.identityservice.dto.request.UserProfileUpdateRequest request) {
        return ResponseEntity.ok(this.userService.updateProfile(id, request));
    }

    @PatchMapping("/me/location")
    @ApiMessage("Cập nhật vị trí người dùng")
    public ResponseEntity<UserDTO> updateLocation(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID id,
            @RequestBody @Valid UpdateLocationRequest request) {
        return ResponseEntity.ok(this.userService.updateLocation(id, request));
    }

    @GetMapping("/username/{username}")
    @ApiMessage("Lấy thông tin theo tên người dùng")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable(value = "username") String username) {
        return ResponseEntity.ok(this.userService.getUserByUsername(username));
    }
}
