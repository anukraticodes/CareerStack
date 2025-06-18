package com.example.demo.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.FileMetadata;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repo.FileMetadataRepo;
import com.example.demo.repo.UserRepo;
import com.example.demo.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    
    @Autowired
    private FileMetadataRepo fileMetadataRepo;

    public UserServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        User user = UserMapper.mapToUser(userDto);
        User savedUser = userRepo.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public UserDto getUserById(String userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist with the given id: " + userId));
        return UserMapper.mapToUserDto(user);
    }


    @Override
    public UserDto validateUser(String userId, String password) throws ResourceNotFoundException {  
        UserDto user = getUserById(userId); 
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!user.getPassword().equals(password)) {
            throw new ResourceNotFoundException("Invalid password");
        }
        return user;
    }
    
    @Override
    public UserDto uploadUserFile(String userId, MultipartFile file, String category) throws ResourceNotFoundException {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String uploadDir = "uploads/" + userId;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String originalFileName = file.getOriginalFilename();
        String fileName = originalFileName;
        Path filePath = Paths.get(uploadDir, fileName);

        try {
            Files.write(filePath, file.getBytes());
        } catch (Exception e) {
        	e.printStackTrace();
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
      
        int version = fileMetadataRepo.countByUserAndFileNameAndCategory(user, originalFileName, category) + 1;
        FileMetadata metadata = new FileMetadata();
        metadata.setUser(user);
        metadata.setFileName(originalFileName);
        metadata.setFilePath(filePath.toString());
        metadata.setCategory(category);
        metadata.setSize(file.getSize());
        metadata.setVersion(version);
        metadata.setUploadDate(LocalDateTime.now());
        metadata.setPubliclyShared(false);
        fileMetadataRepo.saveAndFlush(metadata);
        return UserMapper.mapToUserDto(user);
    }
    
    @Override
    public String generateShareLink(String fileId) {
        FileMetadata file = fileMetadataRepo.findById(Long.parseLong(fileId))
            .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        String token = UUID.randomUUID().toString();
        file.setShareToken(token);
        file.setPubliclyShared(true);

        fileMetadataRepo.save(file);

        return "http://localhost:8080/api/files/share/" + token; // Adjust this to your domain
    }


}

