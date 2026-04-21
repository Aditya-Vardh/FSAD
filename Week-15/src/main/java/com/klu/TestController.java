package com.klu;

import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {
    @GetMapping("/")
    public String home() { return "Application is running successfully!"; }

    @GetMapping("/test")
    public String test() { return "Test API working!"; }

    @PostMapping("/admin/add")
    public String adminAdd() { return "Admin: Employee record added successfully."; }

    @DeleteMapping("/admin/delete")
    public String adminDelete() { return "Admin: Employee record deleted successfully."; }

    @GetMapping("/employee/profile")
    public String employeeProfile() { return "Employee: Profile data accessed successfully."; }
}
