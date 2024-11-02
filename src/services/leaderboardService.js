import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getStudentLeaderboard = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/student/leaderboard`,
      { headers: getAuthHeaders() }
    );
    
    if (!response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching student leaderboard:', error);
    if (error.response?.status === 404) {
      return []; // Return empty array if no leaderboard found
    }
    throw error;
  }
};

export const getFacultyLeaderboard = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/faculty/leaderboard`,
      { headers: getAuthHeaders() }
    );
    
    if (!response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching faculty leaderboard:', error);
    if (error.response?.status === 404) {
      return []; // Return empty array if no leaderboard found
    }
    throw error;
  }
};