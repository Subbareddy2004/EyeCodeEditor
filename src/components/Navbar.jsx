import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    } shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">
              Eye<span className="text-blue-500">Labs</span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className={darkMode ? 'text-gray-200' : 'text-gray-600'} />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-expanded="false"
            >
              {isMenuOpen ? (
                <FaTimes className={`h-6 w-6 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
              ) : (
                <FaBars className={`h-6 w-6 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className={darkMode ? 'text-gray-200' : 'text-gray-600'} />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className={`${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className={`px-4 py-2 rounded-md ${
                    darkMode 
                      ? 'text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md ${
                    darkMode 
                      ? 'text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden pb-4`}>
          {user ? (
            <div className="space-y-2">
              <div className={`px-4 py-2 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                {user.name} ({user.role})
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 