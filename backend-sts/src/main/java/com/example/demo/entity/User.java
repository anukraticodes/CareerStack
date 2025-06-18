package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {

    @Id
    private String userId;
    private String password;
    private String name;
    private String email;
    private String filePath;
    // Default no-argument constructor
    public User() {
    }

    // Constructor with parameters
    public User(String userId, String password, String name, String email, String filePath) {
        this.userId = userId;
        this.password = password;
        this.name = name;
        this.email = email;
        this.filePath=filePath;
    }

    // Getters and setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

}
