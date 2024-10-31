import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
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
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getStudentLeaderboard();
      // Sort students by score in descending order
      const sortedData = data.sort((a, b) => b.score - a.score);
      setStudents(sortedData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find current user's rank
  const currentUserRank = filteredStudents.findIndex(student => student._id === currentUser._id) + 1;

  // Separate current user and other students
  const currentUserData = filteredStudents.find(student => student._id === currentUser._id);
  const otherStudents = filteredStudents.filter(student => student._id !== currentUser._id);

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
              {/* Current User Row */}
              {currentUserData && (
                <tr className={`${darkMode ? 'bg-[#2d3548]' : 'bg-purple-50'} border-b border-[#2d3548]`}>
                  <td className={`px-6 py-4 ${darkMode ? 'text-white' : ''}`}>{currentUserRank}</td>
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
              
              {/* Other Students */}
              {otherStudents.map((student, index) => {
                const rank = index + 1;
                return (
                  <tr key={student._id} 
                    className={`${
                      darkMode 
                        ? 'hover:bg-[#2d3548] border-b border-[#2d3548]' 
                        : 'hover:bg-gray-50 border-b border-gray-200'
                    }`}
                  >
                    <td className={`px-6 py-4 ${darkMode ? 'text-white' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span>{rank}</span>
                        {rank <= 3 && (
                          <span>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
