import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getStudents = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/faculty/students`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/faculty/students`,
      studentData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const importStudents = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/faculty/students/import`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/faculty/students/${studentId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/faculty/students/${studentId}`,
      studentData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};