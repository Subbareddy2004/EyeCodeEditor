import axios from 'axios';

const API_URL = 'http://localhost:5000/api/submissions';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getSubmissions = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch submissions' };
  }
};

export const getSubmissionStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch submission statistics' };
  }
};

export const getRecentSubmissions = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/recent?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch recent submissions' };
  }
};