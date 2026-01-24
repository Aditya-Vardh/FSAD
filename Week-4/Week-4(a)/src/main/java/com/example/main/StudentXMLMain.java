package com.example.main;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import com.example.model.Student;
public class StudentXMLMain {
 public static void main(String[] args) {
 ApplicationContext context =
 new ClassPathXmlApplicationContext("applicationContext.xml");
 Student student = (Student) context.getBean("student");
 student.display();
 }
}