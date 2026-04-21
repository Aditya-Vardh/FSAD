package com.klh.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klh.model.Course;
import com.klh.repository.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course getCourseById(int id) {
        return courseRepository.findById(id).orElse(null);
    }

    @Override
    public Course updateCourse(int id, Course course) {
        Course existing = courseRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(course.getTitle());
            existing.setDuration(course.getDuration());
            existing.setFee(course.getFee());
            return courseRepository.save(existing);
        }
        return null;
    }

    @Override
    public boolean deleteCourse(int id) {
        Course existing = courseRepository.findById(id).orElse(null);
        if (existing != null) {
            courseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Course> searchByTitle(String title) {
        return courseRepository.findByTitle(title);
    }
}