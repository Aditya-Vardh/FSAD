package com.example.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.model.Student;
import com.example.repository.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository repo;

    public StudentService(StudentRepository repo) { this.repo = repo; }

    public Student addStudent(Student student) { return repo.save(student); }
    public List<Student> getAllStudents() { return repo.findAll(); }

    public Student updateStudent(Long id, Student newStudent) {
        Student student = repo.findById(id).orElseThrow();
        student.setName(newStudent.getName());
        student.setEmail(newStudent.getEmail());
        student.setCourse(newStudent.getCourse());
        return repo.save(student);
    }

    public void deleteStudent(Long id) { repo.deleteById(id); }
}
