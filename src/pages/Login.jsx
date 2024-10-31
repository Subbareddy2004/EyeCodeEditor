import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

const Login = ({ onLogin }) => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      const response = await loginUser(email, password);
      console.log('Login response:', response);
      
      if (response && response.user) {
        onLogin(response.user);
        localStorage.setItem('token', response.token);
        toast.success('Login successful!');
        navigate(response.user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard');
      } else {
        setError('Invalid login response');
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Login error details:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <Toaster position="top-right" />
      <div className={`${
        darkMode 
          ? 'bg-[#242b3d] border border-[#2d3548]' 
          : 'bg-white'
      } p-8 rounded-lg shadow-md w-96`}>
        <h2 className={`text-2xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Email or Registration Number</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                  : 'border-gray-300 text-gray-900'
              } border`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                  : 'border-gray-300 text-gray-900'
              } border`}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
