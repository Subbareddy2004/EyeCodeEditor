import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c]' : 'bg-white'}`}>
      {/* Header/Navigation */}
      <div className={`${
        darkMode ? 'bg-[#242b3d]' : 'bg-white'
      } border-b ${
        darkMode ? 'border-[#2d3548]' : 'border-gray-200'
      } fixed w-full z-50`}>
        {/* Your header/navigation content */}
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className={`w-64 fixed h-full ${
          darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'
        } border-r ${
          darkMode ? 'border-[#2d3548]' : 'border-gray-200'
        }`}>
          {/* Sidebar content */}
        </div>
        
        {/* Main Content */}
        <div className={`flex-1 ml-64 ${
          darkMode ? 'bg-[#1a1f2c]' : 'bg-white'
        }`}>
          <div className={`p-6 ${
            darkMode ? 'bg-[#1a1f2c]' : 'bg-white'
          }`}>
            {children}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className={`w-64 fixed right-0 h-full ${
          darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'
        } border-l ${
          darkMode ? 'border-[#2d3548]' : 'border-gray-200'
        }`}>
          {/* Right sidebar content */}
        </div>
      </div>
    </div>
  );
};

export default Layout; 