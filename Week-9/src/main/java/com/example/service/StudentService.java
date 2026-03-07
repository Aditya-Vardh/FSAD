package com.example.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.example.exception.StudentNotFoundException;
import com.example.model.Student;
@Service
public class StudentService {
 private static final Map<Integer, Student> STUDENTS = new HashMap<>();
 static {
 STUDENTS.put(101, new Student(101, "Anita", "CSE"));
 STUDENTS.put(102, new Student(102, "Rahul", "ECE"));
 STUDENTS.put(103, new Student(103, "Sita", "IT"));
 }
 public Student getStudentById(int id) {
 if (!STUDENTS.containsKey(id)) {
 throw new StudentNotFoundException("Student not found with ID: " + id);
 }
 return STUDENTS.get(id);
 }
}