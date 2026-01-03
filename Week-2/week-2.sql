USE college;

CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100)
);

INSERT INTO student (name, department) VALUES
('Aditya', 'CSE'),
('Rahul', 'ECE'),
('Suresh', 'MCA');

SELECT * FROM student;
