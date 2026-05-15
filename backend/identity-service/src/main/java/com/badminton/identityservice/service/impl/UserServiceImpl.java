package com.badminton.identityservice.service.impl;

import com.badminton.common.exception.AppException;
import com.badminton.identityservice.dto.mapper.UserMapper;
import com.badminton.identityservice.dto.message.ObjectResponse;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.model.UserUpdateDTO;
import com.badminton.identityservice.dto.request.UserProfileUpdateRequest;
import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.entity.UserAvailability;
import com.badminton.identityservice.entity.UserPreferredArea;
import com.badminton.identityservice.entity.UserStatus;
import com.badminton.identityservice.repository.RoleRepository;
import com.badminton.identityservice.repository.UserRepository;
import com.badminton.identityservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if(this.userRepository.existsByEmail(userDTO.getEmail())){
            throw new AppException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }

        if(this.userRepository.existsByPhone(userDTO.getPhone())){
            throw new AppException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
        }

        User newUser = this.userMapper.mapToEntity(userDTO);
        newUser.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        newUser.setStatus(UserStatus.ACTIVE);

        Set<Role> roles = new HashSet<>();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleCode : userDTO.getRoles()) {
                Role role = roleRepository.findByCode(roleCode)
                        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò"));
                roles.add(role);
            }
        } else {
            Role userRole = roleRepository.findByCode("USER")
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò"));
            roles.add(userRole);
        }
        newUser.setRoles(roles);

        User userResponse = this.userRepository.save(newUser);
        return this.userMapper.mapToDto(userResponse);
    }

    @Override
    public ObjectResponse getAllUser(Specification<User> specification, Pageable pageable) {
        Page<User> page = userRepository.findAll(specification, pageable);
        ObjectResponse objectResponse = new ObjectResponse();
        ObjectResponse.Meta meta = new ObjectResponse.Meta();

        meta.setTotal(page.getTotalElements());
        meta.setPages(page.getTotalPages());
        meta.setPageSize(pageable.getPageSize());
        meta.setPage(pageable.getPageNumber() + 1);

        objectResponse.setMeta(meta);
        List<UserDTO> productResponseDTOList = page
                .getContent()
                .stream()
                .map(userMapper::mapToDto)
                .toList();

        objectResponse.setResult(productResponseDTOList);
        return objectResponse;
    }

    @Override
    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));
        UserDTO userDTO = this.userMapper.mapToDto(user);
        return userDTO;
    }

    @Override
    public UserDTO updateUser(UserUpdateDTO userUpdateDto, UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));

        user.setFullName(userUpdateDto.getFullName());
        user.setPhone(userUpdateDto.getPhone());
        user.setLevel(userUpdateDto.getLevel());

        User updated = userRepository.save(user);
        UserDTO userDTO = userMapper.mapToDto(updated);
        return userDTO;
    }

    @Override
    @Transactional
    public UserDTO updateProfile(UUID id, UserProfileUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));

        // Cập nhật thông tin cơ bản
        user.setFullName(request.getFullName());
        user.setGender(request.getGender());
        user.setLevel(request.getLevel());
        user.setGoal(request.getGoal());
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl());

        // Cập nhật Khu vực ưu tiên
        user.getPreferredAreas().clear();
        if (request.getPreferredAreas() != null) {
            request.getPreferredAreas().forEach(areaName -> {
                UserPreferredArea area = UserPreferredArea.builder()
                        .user(user)
                        .areaName(areaName)
                        .build();
                user.getPreferredAreas().add(area);
            });
        }

        // Cập nhật Lịch rảnh
        user.getAvailabilities().clear();
        if (request.getAvailabilities() != null) {
            request.getAvailabilities().forEach(availReq -> {
                UserAvailability availability = UserAvailability.builder()
                        .user(user)
                        .dayOfWeek(availReq.getDayOfWeek())
                        .startTime(availReq.getStartTime())
                        .endTime(availReq.getEndTime())
                        .build();
                user.getAvailabilities().add(availability);
            });
        }

        User updatedUser = userRepository.save(user);
        UserDTO userDTO = userMapper.mapToDto(updatedUser);
        return userDTO;
    }

    @Override
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));
        userRepository.delete(user);
    }

    @Override
    public UserDTO getUserProfile(UUID id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));
        UserDTO userDTO = this.userMapper.mapToDto(user);
        return userDTO;
    }

    @Override
    public UserDTO getUserByUsername(String login) {
        User user = this.userRepository.findByEmailOrPhone(login)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));
        UserDTO userDTO = this.userMapper.mapToDto(user);
        return userDTO;
    }
}
