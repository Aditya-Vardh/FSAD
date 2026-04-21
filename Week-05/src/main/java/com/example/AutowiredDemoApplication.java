package com.example;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import com.example.model.Student;
@SpringBootApplication
public class AutowiredDemoApplication {
 public static void main(String[] args) {

 ApplicationContext context =
 SpringApplication.run(AutowiredDemoApplication.class, args);
 Student student = context.getBean(Student.class);
 System.out.println(student);


 }
}