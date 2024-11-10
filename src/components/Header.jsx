import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`${
      darkMode 
        ? 'bg-[#242b3d] border-b border-[#2d3548] text-white' 
        : 'bg-white shadow-md'
    } sticky top-0 z-50`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-xl sm:text-2xl font-bold transition-colors ${
              darkMode ? 'text-white hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'
            }`}
          >
            Eye<span className="text-blue-500">Labs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode 
                ? <FaSun className="text-xl" /> 
                : <FaMoon className="text-xl" />
              }
            </button>
            <Link 
              to="/login" 
              className={`text-base font-medium px-4 py-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-base font-medium bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen 
                ? <FaTimes className="text-xl" /> 
                : <FaBars className="text-xl" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 space-y-3">
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Register
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
