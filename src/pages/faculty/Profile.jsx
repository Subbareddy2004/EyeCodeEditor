import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updatePassword, updateProfile } from '../../services/authService';
import { isAuthenticated, isUserFaculty } from '../../utils/authUtils';
import { Navigate } from 'react-router-dom';

const FacultyProfile = ({ user, onProfileUpdate }) => {
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
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Faculty Profile</h1>
        
        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-5xl" />
            </div>
          </div>
          
          <div className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      name: e.target.value
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      email: e.target.value
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-teal-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-teal-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
            >
              <FaLock />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
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