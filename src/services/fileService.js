import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL;

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_URL}/faculty/upload`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error.response?.data || error;
  }
}; 