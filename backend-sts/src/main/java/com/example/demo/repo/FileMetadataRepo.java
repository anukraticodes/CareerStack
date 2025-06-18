package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.FileMetadata;
import com.example.demo.entity.User;

@Repository
public interface FileMetadataRepo extends JpaRepository<FileMetadata, Long> {
    int countByUserAndFileNameAndCategory(User user, String fileName, String category);

    List<FileMetadata> findByUser_UserId(String userId);
    Optional<FileMetadata> findByShareToken(String shareToken);


 
}
