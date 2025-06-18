package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.UserDto;
import com.example.demo.exception.ResourceNotFoundException;

public interface UserService {
	UserDto createUser(UserDto userDto);
	
	UserDto getUserById(String userId);

	UserDto validateUser(String userId, String password);
	UserDto uploadUserFile(String userId, MultipartFile file, String category) throws Exception;
	String generateShareLink(String fileId);



}
