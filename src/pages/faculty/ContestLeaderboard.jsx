import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContestLeaderboard } from '../../services/contestService';
import { FaTrophy, FaClock, FaCheckCircle, FaHourglassHalf, FaArrowLeft } from 'react-icons/fa';

const ContestLeaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestData, setContestData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!contestData) return <div className="p-4">Contest not found</div>;

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate('/faculty/contests')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Contests
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{contestData.title} - Leaderboard</h1>
        <div className="text-gray-600">
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Taken
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <tr key={entry.student._id} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index < 3 ? (
                    <FaTrophy className={`inline mr-1 ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      'text-bronze-400'
                    }`} />
                  ) : null}
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.student.name}
                  </div>
                  <div className="text-sm text-gray-500">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.score} points
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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