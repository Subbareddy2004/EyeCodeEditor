import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTasks, FaTrophy, FaChartLine, FaUserCircle, FaSignOutAlt, 
         FaGraduationCap, FaHome, FaMoon, FaSun, FaCaretDown, FaBars, FaTimes } from 'react-icons/fa';
import { useClickAway } from '../../hooks/useClickAway';
import { useTheme } from '../../contexts/ThemeContext';

const StudentHeader = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();
  
  useClickAway(dropdownRef, () => setIsDropdownOpen(false));
  useClickAway(mobileMenuRef, () => setIsMobileMenuOpen(false));

  const NavLink = ({ to, icon: Icon, color, children }) => (
    <Link 
      to={to} 
      className={`flex items-center transition-colors ${
        darkMode 
          ? 'text-gray-300 hover:text-white' 
          : 'text-gray-600 hover:text-gray-900'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className={`mr-2 ${color}`} />
      <span>{children}</span>
    </Link>
  );

  return (
    <header className={`${
      darkMode 
        ? 'bg-[#242b3d] border-b border-[#2d3548]' 
        : 'bg-white shadow-md border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Home Link */}
          <div className="flex items-center space-x-4">
            <Link to="/student/dashboard" className={`text-xl sm:text-2xl font-bold flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <FaGraduationCap className="mr-2 text-blue-500" />
              <span className="hidden sm:inline">EyeLabs Student</span>
              <span className="sm:hidden">EyeLabs</span>
            </Link>
          </div>

          {/* Desktop Navigation with colored icons */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavLink to="/student/dashboard" icon={FaHome} color="text-green-500">
              Home
            </NavLink>
            <NavLink to="/student/problems" icon={FaCode} color="text-blue-500">
              Practice
            </NavLink>
            <NavLink to="/student/assignments" icon={FaTasks} color="text-purple-500">
              Assignments
            </NavLink>
            <NavLink to="/student/contests" icon={FaTrophy} color="text-yellow-500">
              Contests
            </NavLink>
            <NavLink to="/student/leaderboard" icon={FaChartLine} color="text-red-500">
              Leaderboard
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>

            {/* Desktop Profile Dropdown */}
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

              {/* Desktop Dropdown Menu */}
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden ${
                  darkMode 
                    ? 'bg-[#242b3d] border border-[#2d3548]' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <ProfileDropdownContent 
                    darkMode={darkMode} 
                    onLogout={onLogout} 
                    closeDropdown={() => setIsDropdownOpen(false)} 
                  />
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Controls */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu with colored icons */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className={`lg:hidden mt-4 py-4 space-y-4 ${
              darkMode ? 'bg-[#242b3d]' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>
                {user.name}
              </span>
            </div>
            
            <div className="space-y-2">
              <MobileNavLink to="/student/dashboard" icon={FaHome} color="text-green-500">
                Home
              </MobileNavLink>
              <MobileNavLink to="/student/problems" icon={FaCode} color="text-blue-500">
                Practice
              </MobileNavLink>
              <MobileNavLink to="/student/assignments" icon={FaTasks} color="text-purple-500">
                Assignments
              </MobileNavLink>
              <MobileNavLink to="/student/contests" icon={FaTrophy} color="text-yellow-500">
                Contests
              </MobileNavLink>
              <MobileNavLink to="/student/leaderboard" icon={FaChartLine} color="text-red-500">
                Leaderboard
              </MobileNavLink>
              <MobileNavLink to="/student/profile" icon={FaUserCircle} color="text-blue-500">
                Profile
              </MobileNavLink>
              
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className={`w-full flex items-center px-4 py-2 transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaSignOutAlt className="mr-2 text-red-500" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Updated Helper Components with colors
const MobileNavLink = ({ to, icon: Icon, color, children }) => {
  const { darkMode } = useTheme();
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 transition-colors ${
        darkMode 
          ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className={`mr-2 ${color}`} />
      {children}
    </Link>
  );
};

const ProfileDropdownContent = ({ darkMode, onLogout, closeDropdown }) => (
  <>
    <Link 
      to="/student/profile" 
      className={`flex items-center px-4 py-3 transition-colors ${
        darkMode 
          ? 'text-gray-300 hover:bg-[#2d3548] hover:text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={closeDropdown}
    >
      <FaUserCircle className="mr-2 text-blue-500" />
      Profile
    </Link>
    <button 
      onClick={() => {
        closeDropdown();
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
  </>
);

export default StudentHeader;
