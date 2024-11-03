import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthHeaders } from '../../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/faculty/leaderboard`, { headers: getAuthHeaders() });
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
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
    entry.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none ${
                darkMode 
                  ? 'bg-[#242b3d] text-white placeholder-gray-500 border-none' 
                  : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200'
              } transition-colors duration-200`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={`rounded-lg ${
          darkMode ? 'bg-[#242b3d]' : 'bg-white'
        } overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${
                  darkMode ? 'bg-[#1e2433] text-gray-400' : 'bg-gray-50 text-gray-600'
                }`}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredLeaderboard.map((entry, index) => (
                  <tr 
                    key={entry.student._id}
                    className={darkMode ? 'hover:bg-[#2d3548]' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 && (
                          <FaTrophy className={`mr-2 ${getTrophyColor(index + 1)}`} />
                        )}
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full ${
                            darkMode ? 'bg-purple-900' : 'bg-purple-100'
                          } flex items-center justify-center ${
                            darkMode ? 'text-purple-200' : 'text-purple-700'
                          }`}>
                            {entry.student.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                            {entry.student.name}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {entry.student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {entry.totalPoints} points
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