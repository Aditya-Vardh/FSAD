import { useState, useEffect } from "react";
import axios from "axios";

function AddStudent({ refreshStudents, editingStudent, setEditingStudent }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setEmail(editingStudent.email);
      setCourse(editingStudent.course);
    }
  }, [editingStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = { name, email, course };
    if (editingStudent) {
      await axios.put(`http://localhost:8085/students/${editingStudent.id}`, student);
      setEditingStudent(null);
    } else {
      await axios.post("http://localhost:8085/students", student);
    }
    setName("");
    setEmail("");
    setCourse("");
    refreshStudents();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>{editingStudent ? "Update Student" : "Add Student"}</h3>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Course" value={course} onChange={e => setCourse(e.target.value)} />
      <div className="form-actions">
        <button type="submit">{editingStudent ? "Update" : "Add"}</button>
        {editingStudent && (
          <button type="button" className="cancel-btn" onClick={() => { setEditingStudent(null); setName(""); setEmail(""); setCourse(""); }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddStudent;
