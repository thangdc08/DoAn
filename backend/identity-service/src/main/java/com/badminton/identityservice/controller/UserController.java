package com.badminton.identityservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.identityservice.dto.message.ObjectResponse;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.model.UserUpdateDTO;
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

import java.util.UUID;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    @ApiMessage("Create user")
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserDTO userDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.createUser(userDTO));
    }

    @GetMapping
    @ApiMessage("Get all users")
    public ResponseEntity<ObjectResponse> getAllUser(
            @Filter Specification<User> specification,
            Pageable pageable
    ){
        return ResponseEntity.ok(this.userService.getAllUser(specification, pageable));
    }

    @GetMapping("/{userId}")
    @ApiMessage("Get user by id")
    public ResponseEntity<UserDTO> getUserById(@PathVariable(value = "userId") UUID id) {
        return ResponseEntity.ok(this.userService.getUserById(id));
    }

    @PutMapping("/{userId}")
    @ApiMessage("Update user")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable(value = "userId") UUID id,
            @RequestBody UserUpdateDTO userDto) {
        return ResponseEntity.ok(this.userService.updateUser(userDto, id));
    }

    @DeleteMapping("/{userId}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable(value = "userId") UUID id) {
        this.userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    @ApiMessage("Get profile")
    public ResponseEntity<UserDTO> getUserProfile(@RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID id) {
        return ResponseEntity.ok(this.userService.getUserProfile(id));
    }

    @GetMapping("/username/{username}")
    @ApiMessage("Get profile by username")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable(value = "username") String username) {
        return ResponseEntity.ok(this.userService.getUserByUsername(username));
    }
}
