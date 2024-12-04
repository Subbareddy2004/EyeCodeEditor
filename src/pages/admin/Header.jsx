import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaMoon, FaSun, FaTachometerAlt, FaChalkboardTeacher,
  FaUserGraduate, FaSignOutAlt, FaUserShield, FaBars, FaTimes,
  FaExclamationCircle
} from 'react-icons/fa';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/faculty', icon: FaChalkboardTeacher, label: 'Faculty' },
    { path: '/admin/students', icon: FaUserGraduate, label: 'Students' },
    { path: '/admin/issues', icon: FaExclamationCircle, label: 'Issues' }
  ];

  const isActive = (path) => {
    return location.pathname === path ? 
      `${darkMode ? 'text-blue-400' : 'text-blue-600'}` : 
      `${darkMode ? 'text-gray-300' : 'text-gray-600'}`;
  };

  return (
    <header className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b shadow-sm sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/admin/dashboard" 
            className={`text-lg sm:text-xl font-bold flex items-center space-x-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            <FaUserShield className="text-blue-500 text-xl sm:text-2xl" />
            <span className="hidden sm:inline">EyeLabs Admin</span>
            <span className="sm:hidden">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive(item.path)} hover:${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                } transition-colors flex items-center space-x-2 py-2 px-3 rounded-md`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

            <div className={`hidden sm:flex items-center space-x-3 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              <span className="font-medium">Admin ({user?.name})</span>
              <button
                onClick={logout}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              ) : (
                <FaBars className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${isActive(item.path)} block px-3 py-2 rounded-md text-base font-medium hover:${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {/* Mobile Logout Button */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout ({user?.name})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader; 