package com.klu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping({"/login", "/api/login"})
    public String login(@RequestBody User user) {
        User dbUser = repo.findByUsername(user.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (dbUser.getPassword().equals(user.getPassword())) {
            return jwtUtil.generateToken(dbUser.getUsername(), dbUser.getRole());
        }
        throw new RuntimeException("Invalid credentials");
    }
}
