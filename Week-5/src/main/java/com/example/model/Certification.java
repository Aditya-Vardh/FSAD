package com.example.model;
import org.springframework.stereotype.Component;
@Component
public class Certification {
 private int id;
 private String name;
 private String dateOfCompletion;
 public Certification() {
 this.id = 101;
 this.name = "Java Full Stack";
 this.dateOfCompletion = "2024-05-10";
 }
 public int getId() {
 return id;
 }
 public void setId(int id) {
 this.id = id;
 }
 public String getName() {
 return name;
 }
 public void setName(String name) {
 this.name = name;
 }
 public String getDateOfCompletion() {
 return dateOfCompletion;
 }
 public void setDateOfCompletion(String dateOfCompletion) {
 this.dateOfCompletion = dateOfCompletion;
 }
 @Override
 public String toString() {
 return "Certification [id=" + id +
 ", name=" + name +
 ", dateOfCompletion=" + dateOfCompletion + "]";
 }
}