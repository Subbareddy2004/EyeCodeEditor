import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEdit } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = ({ user }) => {
  const { darkMode } = useTheme();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/faculty/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        { headers: getAuthHeaders() }
      );
      
      toast.success('Password updated successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <ProfileCard 
            title="Profile Information" 
            color="indigo"
            darkMode={darkMode}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfileItem 
                icon={<FaUser />} 
                label="Name" 
                value={user.name}
                darkMode={darkMode} 
              />
              <ProfileItem 
                icon={<FaEnvelope />} 
                label="Email" 
                value={user.email}
                darkMode={darkMode} 
              />
            </div>
          </ProfileCard>

          <ProfileCard 
            title="Change Password" 
            color="blue"
            darkMode={darkMode}
          >
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({
                    ...passwords,
                    currentPassword: e.target.value
                  })}
                  className={`mt-1 p-1.5 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({
                    ...passwords,
                    newPassword: e.target.value
                  })}
                  className={`mt-1 p-1.5 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value
                  })}
                  className={`mt-1 p-1.5 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ title, color, children, darkMode }) => (
  <div className={`${
    darkMode 
      ? 'bg-[#242b3d] border-t-4 border-blue-500 shadow-xl' 
      : `bg-white border-t-4 border-${color}-500 shadow-lg`
  } rounded-lg p-6`}>
    <h2 className={`text-2xl font-semibold mb-4 ${
      darkMode 
        ? 'text-white' 
        : `text-${color}-800`
    }`}>{title}</h2>
    {children}
  </div>
);

const ProfileItem = ({ icon, label, value, darkMode }) => (
  <div className="flex items-center mb-3">
    <div className={`${
      darkMode ? 'text-blue-400' : 'text-indigo-500'
    } mr-3`}>{icon}</div>
    <div>
      <p className={`text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>{label}</p>
      <p className={`font-medium ${
        darkMode ? 'text-gray-200' : 'text-gray-800'
      }`}>{value}</p>
    </div>
  </div>
);

export default Profile;