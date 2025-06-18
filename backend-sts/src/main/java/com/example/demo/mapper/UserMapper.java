package com.example.demo.mapper;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;

public class UserMapper {

    public static UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getUserId(),
                user.getPassword(),
                user.getName(),
                user.getEmail(),
                user.getFilePath()
        );
    }

    public static User mapToUser(UserDto userDto) {
        return new User(
                userDto.getUserId(),
                userDto.getPassword(),
                userDto.getName(),
                userDto.getEmail(),
                userDto.getFilePath()
        );
    }
}

