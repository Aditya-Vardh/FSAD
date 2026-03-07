package com.klh.service;

import java.util.List;
import com.klh.model.Course;

public interface CourseService {

    Course addCourse(Course course);

    List<Course> getAllCourses();

    Course getCourseById(int id);

    Course updateCourse(int id, Course course);

    boolean deleteCourse(int id);

    List<Course> searchByTitle(String title);
}