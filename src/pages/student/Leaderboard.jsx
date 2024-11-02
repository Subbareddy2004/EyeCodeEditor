import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { getStudentLeaderboard } from '../../services/leaderboardService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Define colors array for user avatars
const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo'];

// Function to get a consistent color for a user based on their ID
const getAvatarColor = (userId) => {
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

// Update the avatar color implementation to use hardcoded classes
const getAvatarBgClass = (userId) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];
  
  if (!userId) return colors[0]; // Default to first color if no ID
  
  const index = userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentLeaderboard();
      
      if (!Array.isArray(data)) {
        console.error('Invalid leaderboard data received:', data);
        setError('Invalid leaderboard data');
        return;
      }

      // Sort students by score in descending order
      const sortedData = data.sort((a, b) => b.score - a.score);
      setStudents(sortedData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student && student.name && 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find current user's data with null check
  const currentUserData = currentUser?._id ? 
    filteredStudents.find(student => student?._id === currentUser._id) : 
    null;

  // Get other students excluding current user
  const otherStudents = currentUser?._id ? 
    filteredStudents.filter(student => student?._id !== currentUser._id) : 
    filteredStudents;

  // Loading State
  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${
        darkMode 
          ? 'bg-[#1a1f2c]' 
          : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
      }`}>
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Leaderboard
        </h1>
        
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } rounded-lg shadow-lg overflow-hidden`}>
          {/* Search Bar Skeleton */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>

          {/* Table Loading Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-[#1a1f2c] border-b border-[#2d3548]' : 'bg-white/50'}>
                <tr>
                  <th className="px-6 py-4 w-24">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </th>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </th>
                  <th className="px-6 py-4 w-24">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, index) => (
                  <tr key={index} className={`${
                    darkMode ? 'border-b border-[#2d3548]' : 'border-b border-gray-200'
                  }`}>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-8"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode 
          ? 'bg-[#1a1f2c]' 
          : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
      }`}>
        <div className="text-center">
          <p className={`text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Failed to load leaderboard
          </p>
          <button
            onClick={loadLeaderboard}
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Leaderboard
      </h1>
      
      <div className={`${
        darkMode 
          ? 'bg-[#242b3d] border border-[#2d3548]' 
          : 'bg-white/80 backdrop-blur-sm'
      } rounded-lg shadow-lg overflow-hidden`}>
        {/* Search Bar */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800'
              } border`}
            />
            <FaSearch className={`absolute right-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-[#1a1f2c] border-b border-[#2d3548]' : 'bg-white/50'}>
              <tr>
                <th className={`px-6 py-4 text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>RANK</th>
                <th className={`px-6 py-4 text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>USER</th>
                <th className={`px-6 py-4 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {/* Current User Row Always at Top */}
              {currentUserData && (
                <tr className={`${darkMode ? 'bg-[#2d3548]' : 'bg-purple-50'} sticky top-0 z-10`}>
                  <td className={`px-6 py-4 ${darkMode ? 'text-white' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span>{currentUserData.rank}</span>
                      {currentUserData.rank <= 3 && (
                        <span>
                          {currentUserData.rank === 1 ? '🥇' : currentUserData.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${getAvatarBgClass(currentUserData._id)} flex items-center justify-center text-white`}>
                        {currentUserData.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={darkMode ? 'text-white' : ''}>
                        {currentUserData.name}
                        <span className={darkMode ? 'text-blue-400' : 'text-purple-600'}> (You)</span>
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right ${darkMode ? 'text-white' : ''}`}>
                    {currentUserData.score}
                  </td>
                </tr>
              )}

              {/* Separator line */}
              <tr className={`${darkMode ? 'border-t-2 border-gray-700' : 'border-t-2 border-gray-200'}`}>
                <td colSpan="3"></td>
              </tr>

              {/* Other Students with their actual ranks */}
              {otherStudents.map((student) => (
                <tr key={student._id} 
                  className={`${
                    darkMode 
                      ? 'hover:bg-[#2d3548] border-b border-[#2d3548]' 
                      : 'hover:bg-gray-50 border-b border-gray-200'
                  }`}
                >
                  <td className={`px-6 py-4 ${darkMode ? 'text-white' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span>{student.rank}</span>
                      {student.rank <= 3 && (
                        <span>{student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉'}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${getAvatarBgClass(student._id)} flex items-center justify-center text-white`}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={darkMode ? 'text-white' : ''}>
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right ${darkMode ? 'text-white' : ''}`}>
                    {student.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
