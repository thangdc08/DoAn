package com.badminton.identityservice.service.impl;

import com.badminton.common.exception.AppException;
import com.badminton.common.exception.ErrorCode;
import com.badminton.identityservice.dto.mapper.UserMapper;
import com.badminton.identityservice.dto.message.ObjectResponse;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.model.UserUpdateDTO;
import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.entity.UserStatus;
import com.badminton.identityservice.repository.RoleRepository;
import com.badminton.identityservice.repository.UserRepository;
import com.badminton.identityservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User newUser = this.userMapper.mapToEntity(userDTO);
        newUser.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        newUser.setStatus(UserStatus.ACTIVE);

        Set<Role> roles = new HashSet<>();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleCode : userDTO.getRoles()) {
                Role role = roleRepository.findByCode(roleCode)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                roles.add(role);
            }
        } else {
            Role userRole = roleRepository.findByCode("USER")
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
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
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return this.userMapper.mapToDto(user);
    }

    @Override
    public UserDTO updateUser(UserUpdateDTO userUpdateDto, UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setFullName(userUpdateDto.getFullName());
        user.setPhone(userUpdateDto.getPhone());

        User updated = userRepository.save(user);
        return userMapper.mapToDto(updated);
    }

    @Override
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userRepository.delete(user);
    }

    @Override
    public UserDTO getUserProfile(UUID id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return this.userMapper.mapToDto(user);
    }

    @Override
    public UserDTO getUserByUsername(String login) {
        User user = this.userRepository.findByEmailOrPhone(login)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return this.userMapper.mapToDto(user);
    }
}
