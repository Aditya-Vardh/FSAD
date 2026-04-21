package com.example.exception;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@ControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(StudentNotFoundException.class)
 public ResponseEntity<Map<String, Object>> handleNotFound(StudentNotFoundException
ex) {
 Map<String, Object> error = new HashMap<>();
 error.put("timestamp", LocalDateTime.now());
 error.put("statusCode", HttpStatus.NOT_FOUND.value());
 error.put("message", ex.getMessage());
 return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
 }
 @ExceptionHandler(InvalidInputException.class)
 public ResponseEntity<Map<String, Object>> handleInvalid(InvalidInputException ex) {
 Map<String, Object> error = new HashMap<>();
 error.put("timestamp", LocalDateTime.now());
 error.put("statusCode", HttpStatus.BAD_REQUEST.value());
 error.put("message", ex.getMessage());
 return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
 }
}