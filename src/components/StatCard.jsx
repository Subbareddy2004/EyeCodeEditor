import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const StatCard = ({ title, value, icon, color }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {React.cloneElement(icon, {
            className: `h-6 w-6 ${color}`
          })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;