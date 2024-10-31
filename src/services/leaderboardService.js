import api from './api';

export const getStudentLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching student leaderboard:', error);
    throw error;
  }
}; 