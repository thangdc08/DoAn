package com.badminton.identityservice.dto.mapper;

import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper mapper;

    public UserDTO mapToDto(User user){
        UserDTO dto = mapper.map(user, UserDTO.class);
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(Role::getCode)
                    .collect(Collectors.toSet()));
        }
        return dto;
    }

    public User mapToEntity(UserDTO userDto){
        User user = mapper.map(userDto, User.class);
        // Note: Roles are handled manually in Service layer for Entity mapping 
        // to avoid fetching from DB inside Mapper.
        return user;
    }
}
