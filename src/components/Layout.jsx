import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c]' : 'bg-white'}`}>
      <div className={`${darkMode ? 'bg-[#242b3d]' : 'bg-white'} border-b ${darkMode ? 'border-[#2d3548]' : 'border-gray-200'}`}>
        {/* Your header/navigation content */}
      </div>
      <div className="flex">
        {/* Left Sidebar */}
        <div className={`w-64 fixed h-full ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
          {/* Sidebar content */}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 ml-64">
          {children}
        </div>
        
        {/* Right Sidebar (if any) */}
        <div className={`w-64 fixed right-0 h-full ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
          {/* Right sidebar content */}
        </div>
      </div>
    </div>
  );
};

export default Layout; 