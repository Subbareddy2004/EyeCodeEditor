import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Loader = ({ size = 'default' }) => {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className={`h-full w-full border-4 border-t-blue-500
          border-b-blue-700 border-l-blue-500 border-r-blue-700
          rounded-full ${darkMode ? 'opacity-80' : 'opacity-100'}`}>
        </div>
      </div>
    </div>
  );
};

export default Loader; 