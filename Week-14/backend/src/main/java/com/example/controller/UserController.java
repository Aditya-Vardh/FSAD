package com.example.controller;

import org.springframework.web.bind.annotation.*;
import com.example.model.User;
import com.example.repository.UserRepository;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserRepository repo;

    public UserController(UserRepository repo) { this.repo = repo; }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return repo.save(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        User existing = repo.findByUsername(user.getUsername());
        Map<String, Object> response = new HashMap<>();
        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            response.put("status", "success");
            response.put("userId", existing.getId());
        } else {
            response.put("status", "fail");
        }
        return response;
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }
}
