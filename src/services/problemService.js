import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all problems (for students)
export const getProblems = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/problems`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error.response?.data || { message: 'Failed to fetch problems' };
  }
};

// Get all problems (for faculty)
export const getFacultyProblems = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/faculty/problems`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching faculty problems:', error);
    throw error.response?.data || { message: 'Failed to fetch problems' };
  }
};

export const getProblem = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/problems/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error.response?.data || error;
  }
};

export const createProblem = async (problemData) => {
  try {
    const response = await axios.post(
      `${API_URL}/faculty/problems`,
      problemData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating problem:', error);
    throw error.response?.data || { message: 'Failed to create problem' };
  }
};

export const updateProblem = async (id, problemData) => {
  try {
    const response = await axios.put(
      `${API_URL}/faculty/problems/${id}`,
      problemData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating problem:', error);
    throw error.response?.data || error;
  }
};

export const deleteProblem = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/faculty/problems/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting problem:', error);
    throw error.response?.data || error;
  }
};