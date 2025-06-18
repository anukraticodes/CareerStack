package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

@Entity
public class FileMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // or other strategy
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fileName;
    private String filePath;
    private String category;
    private Long size;
    private int version;
    private LocalDateTime uploadDate;

    private String shareToken;
    private boolean publiclyShared;
}
