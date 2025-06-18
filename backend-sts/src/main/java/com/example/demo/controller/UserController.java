package com.example.demo.controller;

//import java.net.http.HttpHeaders;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.net.MalformedURLException;
//import java.awt.PageAttributes.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.FileMetadata;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repo.FileMetadataRepo;
import com.example.demo.repo.UserRepo;
import com.example.demo.service.UserService;

//import jakarta.annotation.Resource;
//import jakarta.persistence.criteria.Path;

import org.springframework.ui.Model;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
	
	private FileMetadataRepo fileMetadataRepo;

    public void FileController(FileMetadataRepo fileMetadataRepo) {
        this.fileMetadataRepo = fileMetadataRepo;
    }
	
	private final UserService userService;

	public UserController(UserService userService) {
	    this.userService = userService;
	}

	//add user api
	@PostMapping
	public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto){
		UserDto savedUser=userService.createUser(userDto);
		
		return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
		
	}
	
	
	//get user api
	@GetMapping("{id}")
	public ResponseEntity<UserDto> getUserById(@PathVariable("id") String userId){
		UserDto userDto= userService.getUserById(userId);
		return ResponseEntity.ok(userDto);
		
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody UserDto loginDto) {
	    try {
	        
	        UserDto user = userService.validateUser(loginDto.getUserId(), loginDto.getPassword());
	        user.setPassword(null); 
	       
	        return ResponseEntity.ok(user);
	    } catch (ResourceNotFoundException e) {
	        
	        Map<String, String> error = new HashMap<>();
	        error.put("message", "Invalid userId or password");
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	    } catch (Exception e) {
	        // unexpected errors
	        Map<String, String> error = new HashMap<>();
	        error.put("message", "An internal error occurred");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	    }
	}

	@PostMapping("/upload/{userId}")
	public ResponseEntity<?> uploadFile(
	        @PathVariable String userId,
	        @RequestParam("file") MultipartFile file,
	        @RequestParam(value = "category", required = false) String category) {

	    try {
	        String defaultCategory = "Other";
	        category = (category == null || category.isBlank()) ? defaultCategory : category;

	        UserDto updatedUser = userService.uploadUserFile(userId, file, category);
	        updatedUser.setPassword(null);
	        return ResponseEntity.ok(updatedUser);
	    } catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	    } catch (Exception e) {
	        e.printStackTrace(); 
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body("File upload failed: " + e.getMessage());
	    }

	}
	
	@PostMapping("/files/share/{fileId}")
	public ResponseEntity<?> shareFile(@PathVariable String fileId) {
	    try {
	        String shareLink = userService.generateShareLink(fileId);
	        return ResponseEntity.ok(Collections.singletonMap("shareableLink", shareLink));
	    } catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating link");
	    }
	}


@GetMapping("/files/share/token/{token}")
public ResponseEntity<Resource> getSharedFile(@PathVariable String token) {
    FileMetadata metadata = fileMetadataRepo.findByShareToken(token)
        .orElseThrow(() -> new ResourceNotFoundException("Invalid share link"));

    Path filePath = Paths.get(metadata.getFilePath());

    try {
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("File not accessible");
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);

    } catch (MalformedURLException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}










	

	
	
	
//	@Autowired(required = true)
//	private UserRepo repo;
//	
//	@GetMapping("/register")
//    public String showRegistrationForm(Model model) {
//        model.addAttribute("user", new User());
//        return "register";
//    }
//
//    
//    @PostMapping("/register")
//    public String registerUser(@ModelAttribute User user) {
//    	try {
//        repo.save(user);
//        return "redirect:/";
//    	}
//    	catch(Exception e){
//    		e.printStackTrace();
//    		return "error";
//    	}
//    }
//	
//	@GetMapping("/")
//	public String login(Model model) {
//		User user=new User();
//		model.addAttribute("user", user);
//		return "login";
//	}
//	@PostMapping("/userLogin")
//	public String loginUser(@ModelAttribute("user") User user, Model model) {
//		String userId=user.getUserId();
//		Optional<User> userdata=repo.findById(userId);
//		if(user.getPassword().equals(userdata.get().getPassword())) {
//		model.addAttribute("name", userdata.get().getName());
//		return "home";
//		}
//		else {
//			return "error";
//		}
//	}

}
