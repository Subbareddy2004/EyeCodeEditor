const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  try {
    console.log('Sending registration data:', userData);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log('Registration response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response data:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (!data.user || !data.token) {
      throw new Error('Invalid response format');
    }

    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      _id: payload.id, // Add this line to ensure compatibility
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    localStorage.removeItem('token');
    throw new Error('User not authenticated');
  }
};