import axios from 'axios';

export const getDashboardStats = async () => {
  const response = await axios.get('/api/faculty/dashboard-stats', {
    headers: getAuthHeaders()
  });
  return response.data;
};