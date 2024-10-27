import React from 'react';
import { FaUser, FaEnvelope, FaUserGraduate, FaCode, FaTrophy, FaMedal } from 'react-icons/fa';

const Profile = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-blue-200 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-indigo-800">Student Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard title="Personal Information" color="indigo">
            <ProfileItem icon={<FaUser />} label="Name" value={user.name} />
            <ProfileItem icon={<FaEnvelope />} label="Email" value={user.email} />
            <ProfileItem icon={<FaUserGraduate />} label="Role" value={user.role} />
          </ProfileCard>
          <ProfileCard title="Performance Statistics" color="green">
            <ProfileItem icon={<FaCode />} label="Problems Solved" value="42" />
            <ProfileItem icon={<FaTrophy />} label="Contests Participated" value="5" />
            <ProfileItem icon={<FaMedal />} label="Ranking" value="#1337" />
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ title, color, children }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 border-t-4 border-${color}-500`}>
    <h2 className={`text-2xl font-semibold mb-4 text-${color}-800`}>{title}</h2>
    {children}
  </div>
);

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center mb-3">
    <div className="text-indigo-500 mr-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default Profile;
