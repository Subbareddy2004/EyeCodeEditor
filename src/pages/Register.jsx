import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const userData = await registerUser(formData);
      console.log('Registration successful:', userData);
      toast.success('Registration successful!');
      navigate(userData.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Registration failed');
      console.error('Registration error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <div className={`${
        darkMode 
          ? 'bg-[#242b3d] border border-[#2d3548]' 
          : 'bg-white'
      } p-8 rounded-lg shadow-md w-96`}>
        <h2 className={`text-2xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                  : 'border-gray-300 text-gray-900'
              } border`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
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
            }`}>
              Password
              <span className={`text-sm ml-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>(minimum 6 characters)</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                  : 'border-gray-300 text-gray-900'
              } border`}
              required
              minLength={6}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                  : 'border-gray-300 text-gray-900'
              } border`}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>
          <button 
            type="submit" 
            className={`w-full py-2 rounded transition-colors ${
              darkMode
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
