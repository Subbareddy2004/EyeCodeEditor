import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/problems/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error;
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
    return response.data;
  } catch (error) {
    throw error.response.data;
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

export const createProblem = async (problemData) => {
  try {
    const response = await axios.post(`${API_URL}/problems`, problemData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
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

// Implement other problem-related functions
