import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTasks, FaTrophy, FaChartLine, FaUserCircle, FaSignOutAlt, FaGraduationCap, FaHome } from 'react-icons/fa';
import { useClickAway } from '../../hooks/useClickAway';

const StudentHeader = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => setIsDropdownOpen(false));

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/student/dashboard" className="text-2xl font-bold flex items-center">
              <FaGraduationCap className="mr-2" />
              EyeLabs Student
            </Link>
            
            <Link to="/student/dashboard" className="flex items-center hover:text-blue-200 transition">
              <FaHome className="mr-2" />
              <span>Home</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link to="/student/problems" className="flex items-center hover:text-blue-200 transition">
              <FaCode className="mr-2" />
              <span>Practice</span>
            </Link>
            
            <Link to="/student/assignments" className="flex items-center hover:text-blue-200 transition">
              <FaTasks className="mr-2" />
              <span>Assignments</span>
            </Link>
            
            <Link to="/student/contests" className="flex items-center hover:text-blue-200 transition">
              <FaTrophy className="mr-2" />
              <span>Contests</span>
            </Link>
            
            <Link to="/student/leaderboard" className="flex items-center hover:text-blue-200 transition">
              <FaChartLine className="mr-2" />
              <span>Leaderboard</span>
            </Link>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center hover:text-blue-200 transition focus:outline-none"
              >
                <FaUserCircle className="mr-2 text-xl" />
                <span>{user.name}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/student/profile" 
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    <FaSignOutAlt className="mr-2" />
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
