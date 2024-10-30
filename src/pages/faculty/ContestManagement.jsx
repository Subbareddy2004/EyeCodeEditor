// client/src/pages/faculty/ContestManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContests, deleteContest } from '../../services/contestService';
import { FaCalendarAlt, FaClock, FaUsers, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const data = await getContests();
      setContests(data);
    } catch (error) {
      toast.error('Failed to load contests');
    }
  };

  const handleCreate = () => {
    navigate('/faculty/contests/create');
  };

  const handleEdit = (contestId) => {
    navigate(`/faculty/contests/${contestId}/edit`);
  };

  const handleDelete = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await deleteContest(contestId);
        toast.success('Contest deleted successfully');
        loadContests();
      } catch (error) {
        toast.error('Failed to delete contest');
      }
    }
  };

  const handleLeaderboard = (contestId) => {
    navigate(`/faculty/contests/${contestId}/leaderboard`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900">Contest Management</h1>
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            + Create Contest
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <div key={contest._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-indigo-800">{contest.title}</h2>
              
              <div className="flex items-center text-gray-600 mb-2">
                <FaCalendarAlt className="mr-2" />
                {new Date(contest.startTime).toLocaleDateString()}
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <FaClock className="mr-2" />
                {contest.duration} minutes
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <FaUsers className="mr-2" />
                {contest.participants?.length || 0} Participants
              </div>

              <div className="text-gray-700 mb-4">
                <h4 className="font-semibold mb-2">Problems:</h4>
                {contest.problems && contest.problems.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {contest.problems.map((problemData, index) => {
                      if (!problemData?.problem) {
                        return null;
                      }
                      return (
                        <li key={index} className="text-blue-600">
                          {problemData.problem.title} ({problemData.points} pts)
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No problems added</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleLeaderboard(contest._id)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                  <FaTrophy className="inline mr-2" /> Leaderboard
                </button>
                <button
                  onClick={() => handleEdit(contest._id)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contest._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestManagement;
