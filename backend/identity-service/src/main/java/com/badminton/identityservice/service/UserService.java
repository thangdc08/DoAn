package com.badminton.identityservice.service;

import com.badminton.identityservice.dto.message.ObjectResponse;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.model.UserUpdateDTO;
import com.badminton.identityservice.dto.request.UpdateUserRolesRequest;
import com.badminton.identityservice.dto.request.UpdateUserStatusRequest;
import com.badminton.identityservice.dto.request.UserProfileUpdateRequest;
import com.badminton.identityservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);

    ObjectResponse getAllUser(Specification<User> specification, Pageable pageable);

    UserDTO getUserById(UUID id);

    UserDTO updateUser(UserUpdateDTO userDto, UUID id);

    UserDTO updateProfile(UUID id, UserProfileUpdateRequest request);

    UserDTO updateLocation(UUID id, com.badminton.identityservice.dto.request.UpdateLocationRequest request);

    void deleteUser(UUID id);

    UserDTO getUserProfile(UUID id);

    UserDTO getUserByUsername(String login);

    // Admin methods
    Page<UserDTO> getAllUsersForAdmin(String status, String role, String search, Pageable pageable);

    UserDTO updateUserStatus(UUID userId, UpdateUserStatusRequest request);

    UserDTO updateUserRoles(UUID userId, UpdateUserRolesRequest request);
}
