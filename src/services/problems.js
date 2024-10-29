import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getProblems = async () => {
  try {
    const response = await axios.get(`${API_URL}/problems`);
    return response.data;
  } catch (error) {
    throw error.response.data;
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

export const submitSolution = async (id, code, language) => {
  try {
    const response = await axios.post(`${API_URL}/problems/${id}/submit`, { code, language });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const getUpcomingContests = async () => {
  try {
    const response = await axios.get(`${API_URL}/contests/upcoming`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createContest = async (contestData) => {
  try {
    const response = await axios.post(`${API_URL}/contests`, contestData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFacultyProblems = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/faculty/problems`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching faculty problems:', error);
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
    console.error('Error creating problem:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Error creating problem');
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
