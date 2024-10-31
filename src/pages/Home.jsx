import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Welcome to Code Education Platform</h1>
        <p className={`text-xl mb-8 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>This is the home page of your coding education platform.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548]' 
              : 'bg-white'
          } p-6 rounded-lg shadow-md`}>
            <h2 className={`text-2xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>For Students</h2>
            <p className={`mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Practice coding, participate in contests, and improve your skills.</p>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Join as Student
            </Link>
          </div>
          <div className={`${
            darkMode 
              ? 'bg-[#242b3d] border border-[#2d3548]' 
              : 'bg-white'
          } p-6 rounded-lg shadow-md`}>
            <h2 className={`text-2xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>For Faculty</h2>
            <p className={`mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Create problems, manage contests, and guide students in their learning journey.</p>
            <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Join as Faculty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
