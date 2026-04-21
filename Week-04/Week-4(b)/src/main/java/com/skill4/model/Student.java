package com.skill4.model;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Component
public class Student {
 @Value("301")
 private int studentId;
 @Value("XYZ")
 private String name;
 @Value("Spring Core")
 private String course;
 @Value("2025")
 private int year;
 public void display() {
 System.out.println(studentId);
 System.out.println(name);
 System.out.println(course);
 System.out.println(year);
 }
}