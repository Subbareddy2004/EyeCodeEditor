import axios from 'axios';
import { getAuthHeaders } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAssignments = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/assignments`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    if (error.response?.status === 500) {
      throw { message: 'Server error while fetching assignments' };
    }
    throw error.response?.data || { message: 'Failed to fetch assignments' };
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    if (!assignmentData.description) {
      assignmentData.description = `Assignment for ${assignmentData.title}`;
    }
    
    const response = await axios.post(
      `${API_URL}/faculty/assignments`,
      assignmentData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error.response?.data || error;
  }
};

export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/faculty/assignments/${id}`,
      assignmentData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error.response?.data || error;
  }
};

export const deleteAssignment = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/faculty/assignments/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error.response?.data || error;
  }
};

export const getAssignmentSubmissions = async (assignmentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/faculty/assignments/${assignmentId}/submissions`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    throw error.response?.data || { message: 'Failed to fetch submissions' };
  }
};

export const submitAssignment = async (assignmentId, submissionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/assignments/${assignmentId}/submit`,
      submissionData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error.response?.data || { message: 'Failed to submit assignment' };
  }
};