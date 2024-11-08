import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

const ContestLeaderboard = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/contests/${id}/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      toast.error('Error fetching leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`text-center p-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Contest Leaderboard
      </h2>
      <div className="overflow-x-auto">
        <table className={`w-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Problems Solved</th>
              <th className="px-4 py-2">Total Points</th>
              <th className="px-4 py-2">Last Submission</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr 
                key={entry.student.email} 
                className={`border-b ${
                  isDarkMode 
                    ? 'border-gray-700 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{entry.student.name}</td>
                <td className="px-4 py-2 text-center">{entry.problemsSolved}</td>
                <td className="px-4 py-2 text-center">{entry.totalPoints}</td>
                <td className="px-4 py-2 text-center">
                  {entry.lastSubmission ? new Date(entry.lastSubmission).toLocaleTimeString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestLeaderboard; 