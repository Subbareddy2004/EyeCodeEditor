// client/src/pages/faculty/ContestManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaTrophy, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '../../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/contests`,
        { headers: getAuthHeaders() }
      );
      setContests(response.data);
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast.error('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (contestId, currentStatus) => {
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
    }
  };

  const handleDelete = async (contestId) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    
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
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contest Management</h1>
        <Link
          to="/faculty/contests/create"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
        >
          + Create Contest
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <div key={contest._id} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">{contest.title}</h2>
            
            <div className="space-y-3 text-gray-600">
              <div>
                <span className="font-semibold">Start:</span>{' '}
                {new Date(contest.startTime).toLocaleString()}
              </div>
              
              <div>
                <span className="font-semibold">Duration:</span>{' '}
                <span className="text-lg">
                  {contest.duration} {contest.duration === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
              
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span className={`font-medium ${getStatusColor(contest.status)}`}>
                  {contest.status}
                </span>
              </div>
              
              <div>
                <span className="font-semibold">Problems:</span>{' '}
                <span className="text-lg">{contest.problemCount}</span>
              </div>
              
              <div className="flex items-center">
                <span className="font-semibold mr-2">Published:</span>
                <button
                  onClick={() => handlePublishToggle(contest._id, contest.isPublished)}
                  className="text-2xl focus:outline-none"
                >
                  {contest.isPublished ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-6 gap-2">
              <Link 
                to={`/faculty/contests/${contest._id}/leaderboard`}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
              >
                <FaTrophy className="inline mr-2" /> Leaderboard
              </Link>
              
              <Link 
                to={`/faculty/contests/${contest._id}/edit`}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded text-center hover:bg-yellow-600"
              >
                <FaEdit className="inline mr-2" /> Edit
              </Link>
              
              <button
                onClick={() => handleDelete(contest._id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'text-green-500';
    case 'Upcoming':
      return 'text-blue-500';
    case 'Completed':
      return 'text-gray-500';
    case 'Draft':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

export default ContestManagement;
