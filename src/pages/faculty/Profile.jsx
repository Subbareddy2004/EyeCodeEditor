import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEdit, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updatePassword, updateProfile } from '../../services/authService';
import { isAuthenticated, isUserFaculty } from '../../utils/authUtils';
import { Navigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const FacultyProfile = ({ user, onProfileUpdate }) => {
  const { darkMode } = useTheme();

  if (!isAuthenticated() || !isUserFaculty(user)) {
    return <Navigate to="/login" />;
  }

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password updated successfully!');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile(profileData);
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Faculty Profile</h1>
        
        {/* Profile Information Card */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
        }`}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-5xl" />
            </div>
          </div>
          
          <div className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className={`block mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      name: e.target.value
                    })}
                    className={`w-full p-2 rounded-lg ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:ring-teal-400' 
                        : 'border-gray-300 focus:ring-teal-500'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      email: e.target.value
                    })}
                    className={`w-full p-2 rounded-lg ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:ring-teal-400' 
                        : 'border-gray-300 focus:ring-teal-500'
                    }`}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={`px-4 py-2 ${
                      darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={`flex items-center space-x-4 p-3 rounded-lg ${
                  darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
                }`}>
                  <FaUser className="text-teal-500 text-xl" />
                  <div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Name</p>
                    <p className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{user.name}</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-4 p-3 rounded-lg ${
                  darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
                }`}>
                  <FaEnvelope className="text-teal-500 text-xl" />
                  <div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Email</p>
                    <p className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-teal-500 hover:text-teal-400"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center space-x-2 text-teal-500 hover:text-teal-400"
            >
              <FaLock />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className={`rounded-lg shadow-md p-6 ${
            darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className={`block mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })}
                  className={`w-full p-2 rounded-lg ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:ring-teal-400' 
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                  className={`w-full p-2 rounded-lg ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:ring-teal-400' 
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })}
                  className={`w-full p-2 rounded-lg ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:ring-teal-400' 
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className={`px-4 py-2 ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyProfile;