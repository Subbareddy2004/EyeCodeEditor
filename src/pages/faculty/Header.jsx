import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaCode, FaTasks, FaTrophy, FaUsers, FaChartLine, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useClickAway } from '../../hooks/useClickAway';

const FacultyHeader = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => setIsDropdownOpen(false));

  return (
    <header className="bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/faculty/dashboard" className="text-2xl font-bold flex items-center">
            <FaChalkboardTeacher className="mr-2" />
            EyeLabs Faculty
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/faculty/problems" className="flex items-center hover:text-green-200 transition">
              <FaCode className="mr-2" />
              <span>Problems</span>
            </Link>
            
            <Link to="/faculty/assignments" className="flex items-center hover:text-green-200 transition">
              <FaTasks className="mr-2" />
              <span>Assignments</span>
            </Link>
            
            <Link to="/faculty/contests" className="flex items-center hover:text-green-200 transition">
              <FaTrophy className="mr-2" />
              <span>Contests</span>
            </Link>
            
            <Link to="/faculty/students" className="flex items-center hover:text-green-200 transition">
              <FaUsers className="mr-2" />
              <span>Students</span>
            </Link>
            
            <Link to="/faculty/leaderboard" className="flex items-center hover:text-green-200 transition">
              <FaChartLine className="mr-2" />
              <span>Leaderboard</span>
            </Link>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center hover:text-green-200 transition focus:outline-none"
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
                    to="/faculty/profile" 
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-teal-500 hover:text-white"
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
                    className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-teal-500 hover:text-white"
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

export default FacultyHeader;
