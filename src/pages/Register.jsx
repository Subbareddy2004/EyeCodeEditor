import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, registerAdmin } from '../services/auth';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    adminCode: '',
    institution: '',
    department: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = formData.role === 'admin' 
        ? await registerAdmin(formData)
        : await registerUser(formData);

      console.log('Registration successful:', userData);
      toast.success(`${formData.role} registered successfully!`);
      
      switch (userData.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'faculty':
          navigate('/faculty/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Clear error when user starts typing
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'
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
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className={`block mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className={`block mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Password
              <span className="text-sm text-gray-500 ml-1">(minimum 6 characters)</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
              minLength={6}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className={`block mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role === 'admin' && (
            <>
              <div className="mb-4">
                <label htmlFor="adminCode" className={`block mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Admin Registration Code</label>
                <input
                  type="password"
                  id="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="institution" className={`block mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Institution Name</label>
                <input
                  type="text"
                  id="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="department" className={`block mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Department</label>
                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </>
          )}
          <button 
            type="submit" 
            className={`w-full py-2 rounded transition duration-200 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
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
