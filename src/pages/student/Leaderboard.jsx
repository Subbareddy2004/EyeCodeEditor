import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaTrophy, FaSearch, FaSpinner } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/assignments/leaderboard`);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getTrophyColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${
        darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-800'
      }`}>
        <FaSpinner className="animate-spin text-3xl mr-2" />
        <span>Loading leaderboard...</span>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto relative">
        <h1 className={`text-2xl font-semibold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Student Leaderboard
        </h1>

        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${
                darkMode 
                  ? 'bg-[#1e2433] text-gray-300 placeholder-gray-500' 
                  : 'bg-white text-gray-900 placeholder-gray-400'
              } focus:outline-none`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={`rounded-lg ${
          darkMode ? 'bg-[#242b3d]' : 'bg-white'
        } overflow-hidden relative z-0`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${
                  darkMode ? 'bg-[#1e2433] text-gray-400' : 'bg-gray-50 text-gray-600'
                }`}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Problems Solved</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredLeaderboard.map((entry) => (
                  <tr 
                    key={entry.student._id}
                    className={`${
                      entry.student._id === user?.id 
                        ? (darkMode ? 'bg-blue-900/20' : 'bg-blue-50') 
                        : (darkMode ? 'hover:bg-[#1e2433]' : 'hover:bg-gray-50')
                    } transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {entry.rank <= 3 && (
                          <FaTrophy className={`mr-2 ${getTrophyColor(entry.rank)} text-lg`} />
                        )}
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                          {entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {entry.student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {entry.totalPoints} points
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      } font-medium`}>
                        {entry.problemsSolved}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
