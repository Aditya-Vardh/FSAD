package com.klu;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    @GetMapping({"/", "/api", "/api/"})
    public String home() { return "Application is running successfully!"; }

    @GetMapping({"/test", "/api/test"})
    public String test() { return "Test API working!"; }

    @PostMapping({"/admin/add", "/api/admin/add"})
    public String adminAdd() { return "Admin: Employee record added successfully."; }

    @DeleteMapping({"/admin/delete", "/api/admin/delete"})
    public String adminDelete() { return "Admin: Employee record deleted successfully."; }

    @GetMapping({"/employee/profile", "/api/employee/profile"})
    public String employeeProfile() { return "Employee: Profile data accessed successfully."; }
}
