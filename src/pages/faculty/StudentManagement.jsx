// client/src/pages/faculty/StudentManagement.jsx
import React, { useState, useEffect } from 'react';
import { uploadStudents, getAllStudents, updateStudent, deleteStudent, resetPassword } from '../../services/studentService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await getAllStudents();
    setStudents(data);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    await uploadStudents(formData);
    fetchStudents();
  };

  const handleUpdateStudent = async (id, updatedData) => {
    await updateStudent(id, updatedData);
    fetchStudents();
  };

  const handleDeleteStudent = async (id) => {
    await deleteStudent(id);
    fetchStudents();
  };

  const handleResetPassword = async (id) => {
    await resetPassword(id);
    // Show success message
  };

  return (
    <div>
      <h1>Student Management</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload Students</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.username}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleUpdateStudent(student._id, { /* updated data */ })}>Edit</button>
                <button onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                <button onClick={() => handleResetPassword(student._id)}>Reset Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;