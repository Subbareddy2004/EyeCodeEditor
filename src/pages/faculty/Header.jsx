import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaCode, FaTasks, FaTrophy, FaUsers, FaChartLine, FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { useClickAway } from '../../hooks/useClickAway';
import { useTheme } from '../../contexts/ThemeContext';

const FacultyHeader = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => setIsDropdownOpen(false));

  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`${
      darkMode 
        ? 'bg-[#242b3d] border-b border-[#2d3548]' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/faculty/dashboard" className={`text-2xl font-bold flex items-center ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <FaChalkboardTeacher className="mr-2 text-blue-500" />
            EyeLabs Faculty
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/faculty/problems" className={`flex items-center transition ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              <FaCode className="mr-2 text-green-500" />
              <span>Problems</span>
            </Link>
            
            <Link to="/faculty/assignments" className={`flex items-center transition ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              <FaTasks className="mr-2 text-purple-500" />
              <span>Assignments</span>
            </Link>
            
            <Link to="/faculty/contests" className={`flex items-center transition ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              <FaTrophy className="mr-2 text-yellow-500" />
              <span>Contests</span>
            </Link>
            
            <Link to="/faculty/students" className={`flex items-center transition ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              <FaUsers className="mr-2 text-indigo-500" />
              <span>Students</span>
            </Link>
            
            <Link to="/faculty/leaderboard" className={`flex items-center transition ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              <FaChartLine className="mr-2 text-red-500" />
              <span>Leaderboard</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'text-yellow-400 hover:bg-[#2d3548]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center transition focus:outline-none ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <FaUserCircle className="mr-2 text-xl text-teal-500" />
                <span>{user.name}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                  darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
                }`}>
                  <Link 
                    to="/faculty/profile" 
                    className={`flex items-center px-4 py-2 ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-2 text-teal-500" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className={`flex items-center w-full px-4 py-2 ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

export default FacultyHeader;
