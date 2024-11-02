import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaMoon, FaSun, FaTachometerAlt, FaChalkboardTeacher,
  FaUserGraduate, FaSignOutAlt, FaUserShield
} from 'react-icons/fa';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/faculty', icon: FaChalkboardTeacher, label: 'Faculty' },
    { path: '/admin/students', icon: FaUserGraduate, label: 'Students' }
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
            className={`text-xl font-bold flex items-center space-x-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            <FaUserShield className="text-blue-500 text-2xl" />
            <span>EyeLabs Admin</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
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
          <div className="flex items-center space-x-4">
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

            <div className={`flex items-center space-x-3 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              <span className="font-medium hidden sm:inline">Admin ({user?.name})</span>
              <button
                onClick={logout}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 