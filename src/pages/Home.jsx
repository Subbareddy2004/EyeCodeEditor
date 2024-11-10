import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className={`text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Welcome to <span className="text-blue-500">Eye</span>Labs
          </h1>
          <p className={`text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            A comprehensive coding education platform with interactive learning, 
            real-time code execution, and powerful assessment tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Code Execution Card */}
          <div className={`p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548] hover:border-blue-500/30' 
              : 'bg-white hover:shadow-2xl'
          }`}>
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Real-time Code Execution
            </h2>
            <ul className={`mb-6 space-y-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Multiple language support
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Syntax highlighting
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Instant feedback
              </li>
            </ul>
          </div>

          {/* Assessment Tools Card */}
          <div className={`p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548] hover:border-green-500/30' 
              : 'bg-white hover:shadow-2xl'
          }`}>
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Assessment Tools
            </h2>
            <ul className={`mb-6 space-y-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Custom assignments
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Automated grading
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Progress tracking
              </li>
            </ul>
          </div>

          {/* Competition Platform Card */}
          <div className={`p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548] hover:border-purple-500/30' 
              : 'bg-white hover:shadow-2xl'
          }`}>
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15l-2 5l9-9l-9-9l2 5l-5 4l5 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Competition Platform
            </h2>
            <ul className={`mb-6 space-y-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Live contests
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Leaderboards
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Performance analytics
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
