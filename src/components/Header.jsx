import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`${
      darkMode 
        ? 'bg-[#242b3d] border-b border-[#2d3548] text-white' 
        : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <Link to="/" className={`text-xl sm:text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>EyeLabs</Link>
          <nav className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="text-lg sm:text-xl" /> : <FaMoon className="text-lg sm:text-xl" />}
            </button>
            <Link to="/login" className={`text-sm sm:text-base ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}>Login</Link>
            <Link to="/register" className="text-sm sm:text-base bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-600 transition">
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
