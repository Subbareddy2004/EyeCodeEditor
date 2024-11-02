import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Welcome to <span className="text-blue-500">Eye</span>Labs
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Elevate your coding journey with interactive learning, real-time contests, 
            and personalized guidance from expert faculty.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Card */}
          <div className={`p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548] hover:border-blue-500/30' 
              : 'bg-white hover:shadow-2xl'
          }`}>
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21h6m-6 0H7a4 4 0 01-4-4v-8a4 4 0 014-4h10a4 4 0 014 4v8a4 4 0 01-4 4h-2m-6 0v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3v6l2-2m-2 2l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13h8m-8 4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              For Students
            </h2>
            <ul className={`mb-6 space-y-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Practice coding challenges
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Participate in live contests
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Track your progress
              </li>
            </ul>
            <Link 
              to="/register" 
              className={`w-full text-center inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20'
              } text-white`}
            >
              Join as Student
            </Link>
          </div>

          {/* Faculty Card */}
          <div className={`p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548] hover:border-green-500/30' 
              : 'bg-white hover:shadow-2xl'
          }`}>
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              For Faculty
            </h2>
            <ul className={`mb-6 space-y-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Create custom problems
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Organize coding contests
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Monitor student progress
              </li>
            </ul>
            <Link 
              to="/register" 
              className={`w-full text-center inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' 
                  : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20'
              } text-white`}
            >
              Join as Faculty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
