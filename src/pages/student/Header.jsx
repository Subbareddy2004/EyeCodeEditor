import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTasks, FaTrophy, FaChartLine, FaUserCircle, FaSignOutAlt, FaGraduationCap, FaHome, FaMoon, FaSun, FaCaretDown } from 'react-icons/fa';
import { useClickAway } from '../../hooks/useClickAway';
import { useTheme } from '../../contexts/ThemeContext';

const StudentHeader = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();
  useClickAway(dropdownRef, () => setIsDropdownOpen(false));

  return (
    <header className={`${
      darkMode 
        ? 'bg-[#242b3d] border-b border-[#2d3548]' 
        : 'bg-white shadow-md border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/student/dashboard" className={`text-2xl font-bold flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <FaGraduationCap className="mr-2 text-blue-500" />
              EyeLabs Student
            </Link>
            
            <Link to="/student/dashboard" className={`flex items-center transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>
              <FaHome className="mr-2 text-green-500" />
              <span>Home</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link to="/student/problems" className={`flex items-center transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>
              <FaCode className="mr-2 text-purple-500" />
              <span>Practice</span>
            </Link>
            
            <Link to="/student/assignments" className={`flex items-center transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>
              <FaTasks className="mr-2 text-orange-500" />
              <span>Assignments</span>
            </Link>
            
            <Link to="/student/contests" className={`flex items-center transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>
              <FaTrophy className="mr-2 text-yellow-500" />
              <span>Contests</span>
            </Link>
            
            <Link to="/student/leaderboard" className={`flex items-center transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>
              <FaChartLine className="mr-2 text-red-500" />
              <span>Leaderboard</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-xl" />
              ) : (
                <FaMoon className="text-xl" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-[#2d3548]' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="mr-2">{user.name}</span>
                <FaCaretDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden ${
                  darkMode 
                    ? 'bg-[#242b3d] border border-[#2d3548]' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <Link 
                    to="/student/profile" 
                    className={`flex items-center px-4 py-3 transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-2 text-blue-500" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className={`flex items-center w-full px-4 py-3 transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaSignOutAlt className="mr-2 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
