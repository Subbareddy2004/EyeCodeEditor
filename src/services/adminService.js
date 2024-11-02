import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add auth token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching dashboard stats' };
  }
};

// Faculty Management
export const getFacultyList = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/faculty`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching faculty list' };
  }
};

export const addFaculty = async (facultyData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/faculty`, facultyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding faculty' };
  }
};

export const updateFaculty = async (id, facultyData) => {
  try {
    const response = await axios.put(`${API_URL}/admin/faculty/${id}`, facultyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating faculty' };
  }
};

export const deleteFaculty = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/faculty/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting faculty' };
  }
};

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/analytics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching analytics' };
  }
};

export const getFacultyDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/admin/faculty/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching faculty details' };
  }
}; 