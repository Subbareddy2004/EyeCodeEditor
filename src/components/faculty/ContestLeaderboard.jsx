import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ContestLeaderboard = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center p-4">Loading leaderboard...</div>;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Contest Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-gray-700">
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
              <tr key={entry.student.email} className="border-b border-gray-700">
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