import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add student
export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_URL}/faculty/students`, {
      name: studentData.name,
      email: studentData.email.toLowerCase(),
      regNumber: studentData.regNumber
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding student' };
  }
};

// Import students from CSV
export const importStudents = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/faculty/students/import`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error importing students' };
  }
};

// Download template
export const downloadTemplate = () => {
  const template = 'Name,Email,Registration Number\n';
  const blob = new Blob([template], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Get faculty's students
export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/faculty/students`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching students' };
  }
};

// Delete student
export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/faculty/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting student' };
  }
};

// Update student
export const updateStudent = async (id, studentData) => {
  try {
    const response = await axios.put(`${API_URL}/faculty/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating student' };
  }
};