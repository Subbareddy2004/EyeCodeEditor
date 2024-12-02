import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { FaTrophy } from 'react-icons/fa';

const AdminContestLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { id } = useParams();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/admin/contests/${id}/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      toast.error('Error fetching leaderboard');
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Contest Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Rank</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.userId}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{entry.name}</td>
                <td className="py-2 px-4 border-b">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContestLeaderboard; 