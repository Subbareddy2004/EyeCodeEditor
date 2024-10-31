import api from './api';

export const getStudentLeaderboard = async () => {
  try {
    const response = await api.get('/students/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching student leaderboard:', error);
    throw error;
  }
};