import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  // Fake users for demonstration purposes
  const fakeUsers = {
    student: {
      id: '123456',
      name: 'Subbareddy',
      email: '1234@gmail.com',
      role: 'student'
    },
    faculty: {
      id: '789012',
      name: 'Demo Faculty',
      email: 'faculty@example.com',
      role: 'faculty'
    }
  };

  // Check if the entered credentials match any of the fake users
  let user;
  if (email === '1234@gmail.com' && password === '1234') {
    user = fakeUsers.student;
  } else if (email === 'raja@gmail.com' && password === 'raja') {
    user = fakeUsers.faculty;
  }

  if (user) {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a fake token and user data
    return {
      token: 'fake-jwt-token-' + user.role,
      user: user
    };
  }

  // If credentials don't match, throw an error
  throw new Error('Invalid credentials');
};

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      throw new Error("Oops, we haven't got JSON!");
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Implement other auth-related functions (logout, etc.)
