package com.klhb.service;

import org.springframework.stereotype.Component;

@Component
public class GreetingService {

    public String getMessage() {
        return "Hello from Greeting Service";
    }
}
