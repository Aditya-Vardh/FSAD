package com.klhb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Student {

    @Autowired
    private GreetingService greetingService;

    public void displayMessage() {
        System.out.println("Student at KLHB says:");
        System.out.println(greetingService.getMessage());
    }
}
