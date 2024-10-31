import React from 'react';
import { FaUser, FaEnvelope, FaUserGraduate, FaCode, FaTrophy, FaMedal } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Profile = ({ user }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 to-blue-200'
    }`}>
      <div className="container mx-auto p-6">
        <h1 className={`text-4xl font-bold mb-8 ${
          darkMode ? 'text-white' : 'text-indigo-800'
        }`}>Student Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard 
            title="Personal Information" 
            color="indigo"
            darkMode={darkMode}
          >
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
            <ProfileItem 
              icon={<FaUserGraduate />} 
              label="Role" 
              value={user.role}
              darkMode={darkMode} 
            />
          </ProfileCard>

          <ProfileCard 
            title="Performance Statistics" 
            color="green"
            darkMode={darkMode}
          >
            <ProfileItem 
              icon={<FaCode />} 
              label="Problems Solved" 
              value="42"
              darkMode={darkMode} 
            />
            <ProfileItem 
              icon={<FaTrophy />} 
              label="Contests Participated" 
              value="5"
              darkMode={darkMode} 
            />
            <ProfileItem 
              icon={<FaMedal />} 
              label="Ranking" 
              value="#1337"
              darkMode={darkMode} 
            />
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
