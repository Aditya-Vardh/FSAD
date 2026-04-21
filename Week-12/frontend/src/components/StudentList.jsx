import { useEffect, useState } from "react";
import axios from "axios";
import AddStudent from "./AddStudent";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:8085/students");
    setStudents(res.data);
  };

  useEffect(() => { fetchStudents(); }, []);

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:8085/students/${id}`);
    fetchStudents();
  };

  return (
    <div>
      <AddStudent refreshStudents={fetchStudents} editingStudent={editingStudent} setEditingStudent={setEditingStudent} />
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>
                <button className="update-btn" onClick={() => setEditingStudent(s)}>Update</button>
                <button className="delete-btn" onClick={() => deleteStudent(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
