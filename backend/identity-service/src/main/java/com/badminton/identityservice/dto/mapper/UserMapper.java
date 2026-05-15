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
        if (user.getPreferredAreas() != null) {
            dto.setPreferredAreas(user.getPreferredAreas().stream()
                    .map(com.badminton.identityservice.entity.UserPreferredArea::getAreaName)
                    .collect(Collectors.toList()));
        }
        if (user.getAvailabilities() != null) {
            dto.setAvailabilities(user.getAvailabilities().stream()
                    .map(a -> UserDTO.UserAvailabilityDTO.builder()
                            .dayOfWeek(a.getDayOfWeek())
                            .startTime(a.getStartTime())
                            .endTime(a.getEndTime())
                            .build())
                    .collect(Collectors.toList()));
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
