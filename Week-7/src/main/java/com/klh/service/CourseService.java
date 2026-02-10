package com.klh.service;

import java.util.ArrayList;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import com.klh.model.Course;

@Service
public class CourseService {

    private List<Course> courses = new ArrayList<>();

    public Course addCourse(Course course) {
        courses.add(course);
        return course;
    }

    public List<Course> getAllCourses() {
        return courses;
    }

    public Course getCourseById(int id) {
        for (Course c : courses) {
            if (c.getCourseId() == id) {
                return c;
            }
        }
        return null;
    }

    public Course updateCourse(int id, Course course) {
        for (int i = 0; i < courses.size(); i++) {
            if (courses.get(i).getCourseId() == id) {
                courses.set(i, course);
                return course;
            }
        }
        return null;
    }

    public boolean deleteCourse(int id) {
        for (Course c : courses) {
            if (c.getCourseId() == id) {
                courses.remove(c);
                return true;
            }
        }
        return false;
    }

    public List<Course> searchByTitle(String title) {

        List<Course> result = new ArrayList<>();

        for (Course c : courses) {
            if (c.getTitle().toLowerCase().contains(title.toLowerCase())) {
                result.add(c);
            }
        }

        return result;
    }

	public @Nullable List<Course> getAllCourses1() {
		// TODO Auto-generated method stub
		return null;
	}
}
