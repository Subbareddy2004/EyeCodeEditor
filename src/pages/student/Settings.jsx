import React from 'react';
import { FaBell, FaLock, FaPalette, FaLanguage } from 'react-icons/fa';

const Settings = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-blue-200 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-indigo-800">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingCard icon={<FaBell />} title="Notifications" color="indigo">
            <p className="text-gray-600">Manage your notification preferences</p>
          </SettingCard>
          <SettingCard icon={<FaLock />} title="Privacy" color="green">
            <p className="text-gray-600">Control your privacy settings</p>
          </SettingCard>
          <SettingCard icon={<FaPalette />} title="Appearance" color="purple">
            <p className="text-gray-600">Customize the look and feel of your dashboard</p>
          </SettingCard>
          <SettingCard icon={<FaLanguage />} title="Language" color="yellow">
            <p className="text-gray-600">Change your preferred language</p>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

const SettingCard = ({ icon, title, color, children }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center mb-4">
      <div className={`bg-${color}-100 p-3 rounded-full mr-4`}>
        <div className={`text-${color}-500 text-2xl`}>{icon}</div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

export default Settings;
