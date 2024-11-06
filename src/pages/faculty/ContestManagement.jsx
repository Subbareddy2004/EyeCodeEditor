// client/src/pages/faculty/ContestManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaTrophy, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthHeaders } from '../../utils/authUtils';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/contests`,
        { headers: getAuthHeaders() }
      );
      setContests(response.data);
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast.error('Failed to load contests: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handlePublishToggle = async (contestId, currentStatus) => {
    setActionLoading(`publish-${contestId}`);
    try {
      await axios.patch(
        `${API_URL}/faculty/contests/${contestId}/publish`,
        { isPublished: !currentStatus },
        { headers: getAuthHeaders() }
      );
      await fetchContests();
      toast.success(`Contest ${currentStatus ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update contest status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (contestId) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    
    setActionLoading(`delete-${contestId}`);
    try {
      await axios.delete(
        `${API_URL}/faculty/contests/${contestId}`,
        { headers: getAuthHeaders() }
      );
      await fetchContests();
      toast.success('Contest deleted successfully');
    } catch (error) {
      console.error('Error deleting contest:', error);
      toast.error('Failed to delete contest');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-3xl mr-2" />
        <span>Loading contests...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Contest Management
        </h1>
        <Link
          to="/faculty/contests/create"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          + Create Contest
        </Link>
      </div>

      {contests.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <FaTrophy className="mx-auto text-4xl mb-4 opacity-50" />
          <p className="text-xl">No contests found. Create your first contest to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <div key={contest._id} className={`${
              darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
            } rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>{contest.title}</h2>
              
              <div className={`space-y-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <div>
                  <span className={`font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Start:</span>{' '}
                  {new Date(contest.startTime).toLocaleString()}
                </div>
                
                <div>
                  <span className={`font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Duration:</span>{' '}
                  {contest.duration} minutes
                </div>
                
                <div>
                  <span className={`font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Status:</span>{' '}
                  <span className={`font-medium ${getStatusColor(contest.status, darkMode)}`}>
                    {contest.status}
                  </span>
                </div>
                
                <div>
                  <span className={`font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Problems:</span>{' '}
                  {contest.problemCount}
                </div>

                <div>
                  <span className={`font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Participants:</span>{' '}
                  {contest.participantCount}
                </div>

                <div className="flex items-center justify-between mt-4 mb-2">
                  <span className={`font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Published:</span>
                  <button
                    onClick={() => handlePublishToggle(contest._id, contest.isPublished)}
                    disabled={actionLoading === `publish-${contest._id}`}
                    className={`flex items-center px-3 py-1 rounded ${
                      contest.isPublished 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white transition-colors duration-200`}
                  >
                    {actionLoading === `publish-${contest._id}` ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : contest.isPublished ? (
                      <><FaToggleOn className="mr-2" /> Published</>
                    ) : (
                      <><FaToggleOff className="mr-2" /> Draft</>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-6 gap-2">
                <Link 
                  to={`/faculty/contests/${contest._id}/leaderboard`}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600 disabled:opacity-50"
                >
                  <FaTrophy className="inline mr-2" /> Leaderboard
                </Link>
                
                <Link 
                  to={`/faculty/contests/${contest._id}/edit`}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded text-center hover:bg-yellow-600 disabled:opacity-50"
                >
                  <FaEdit className="inline mr-2" /> Edit
                </Link>
                
                <button
                  onClick={() => handleDelete(contest._id)}
                  disabled={actionLoading === `delete-${contest._id}`}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading === `delete-${contest._id}` ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaTrash className="mr-2" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status, darkMode) => {
  switch (status) {
    case 'Active':
      return darkMode ? 'text-green-400' : 'text-green-500';
    case 'Upcoming':
      return darkMode ? 'text-blue-400' : 'text-blue-500';
    case 'Completed':
      return darkMode ? 'text-gray-400' : 'text-gray-500';
    case 'Draft':
      return darkMode ? 'text-yellow-400' : 'text-yellow-500';
    default:
      return darkMode ? 'text-gray-400' : 'text-gray-500';
  }
};

export default ContestManagement;
