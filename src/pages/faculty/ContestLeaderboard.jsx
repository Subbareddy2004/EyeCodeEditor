import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContestLeaderboard } from '../../services/contestService';
import { FaTrophy, FaClock, FaCheckCircle, FaHourglassHalf, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ContestLeaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestData, setContestData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadLeaderboard();
  }, [id]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getContestLeaderboard(id);
      setContestData(data.contest);
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={`flex justify-center items-center p-8 ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>
      <FaSpinner className="animate-spin text-3xl mr-2" />
      <span>Loading leaderboard...</span>
    </div>
  );
  
  if (error) return (
    <div className="p-4 text-red-600 bg-red-100 rounded-lg">
      {error}
    </div>
  );
  
  if (!contestData) return (
    <div className={`p-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      Contest not found
    </div>
  );

  return (
    <div className={`p-6 min-h-screen ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'
    }`}>
      <button 
        onClick={() => navigate('/faculty/contests')}
        className={`mb-6 flex items-center transition-colors ${
          darkMode 
            ? 'text-gray-300 hover:text-white' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <FaArrowLeft className="mr-2" />
        Back to Contests
      </button>

      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {contestData.title} - Leaderboard
        </h1>
        <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          <span className="mr-4">
            <FaClock className="inline mr-1" />
            Duration: {contestData.duration} minutes
          </span>
          <span>
            <FaCheckCircle className="inline mr-1" />
            {leaderboard.filter(entry => entry.status === 'Submitted').length} Submissions
          </span>
        </div>
      </div>

      <div className={`rounded-lg shadow overflow-hidden ${
        darkMode ? 'bg-[#242b3d]' : 'bg-white'
      }`}>
        <table className="min-w-full">
          <thead className={darkMode ? 'bg-[#1e2433]' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Rank
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Student
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Status
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Score
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Time Taken
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            darkMode ? 'divide-[#2d3548] bg-[#242b3d]' : 'divide-gray-200 bg-white'
          }`}>
            {leaderboard.map((entry, index) => (
              <tr key={entry.student._id} className={
                darkMode 
                  ? index < 3 ? 'bg-[#2d3548]' : ''
                  : index < 3 ? 'bg-yellow-50' : ''
              }>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index < 3 ? (
                    <FaTrophy className={`inline mr-1 ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      'text-bronze-400'
                    }`} />
                  ) : null}
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {entry.student.name}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {entry.student.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    entry.status === 'Submitted' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status === 'Submitted' ? (
                      <FaCheckCircle className="mr-1" />
                    ) : (
                      <FaHourglassHalf className="mr-1" />
                    )}
                    {entry.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {entry.score} points
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {entry.totalTime ? `${Math.round(entry.totalTime)} mins` : '-'}
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