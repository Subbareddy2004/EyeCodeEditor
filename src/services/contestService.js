import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Student-facing contest functions
export const getContests = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/contests`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error.response?.data || { message: 'Failed to fetch contests' };
  }
};

export const getContest = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/contests/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contest:', error);
    throw error.response?.data || error;
  }
};

export const joinContest = async (contestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/contests/${contestId}/join`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Faculty-facing contest functions
export const createContest = async (contestData) => {
  try {
    const response = await axios.post(
      `${API_URL}/faculty/contests`,
      contestData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating contest:', error);
    throw error.response?.data || { message: 'Failed to create contest' };
  }
};

export const updateContest = async (id, contestData) => {
  try {
    const response = await axios.put(
      `${API_URL}/faculty/contests/${id}`,
      contestData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating contest:', error);
    throw error.response?.data || error;
  }
};

export const deleteContest = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/faculty/contests/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting contest:', error);
    throw error.response?.data || error;
  }
};

export const getContestSubmissions = async (contestId) => {
  try {
    const response = await axios.get(
      `${API_URL}/faculty/contests/${contestId}/submissions`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contest submissions:', error);
    throw error.response?.data || error;
  }
};

export const getContestLeaderboard = async (contestId) => {
  try {
    const response = await axios.get(
      `${API_URL}/faculty/contests/${contestId}/leaderboard`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contest leaderboard:', error);
    throw error.response?.data || error;
  }
};