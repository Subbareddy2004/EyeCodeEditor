import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(
      `${API_URL}/faculty/profile`,
      profileData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/change-password`,
      { currentPassword, newPassword },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register-admin`, adminData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error;
  }
}; 