import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all problems (for students)
export const getProblems = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/problems/student/problems`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

// Add this function to get all problems
export const getAllProblems = async () => {
  try {
    const response = await axios.get(`${API_URL}/problems`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

// Get specific problem
export const getProblem = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/problems/student/problems/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error;
  }
};

export const runCode = async (problemId, code, language) => {
  try {
    const response = await axios.post(
      `${API_URL}/problems/student/problems/${problemId}/run`,
      { code, language },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};