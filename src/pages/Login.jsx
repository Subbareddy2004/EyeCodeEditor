import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);
      console.log('Logged in user:', user); // For debugging

      if (!user || !user.role) {
        throw new Error('Invalid user data received');
      }

      // Navigate based on user role
      switch (user.role) {
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
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    }
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
        <h2 className={`text-2xl font-bold mb-6 text-center ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Email or Registration Number</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="mb-6">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="text-center mt-2 mb-4">
            <Link
              to="/forgot-password"
              className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded transition duration-200 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
