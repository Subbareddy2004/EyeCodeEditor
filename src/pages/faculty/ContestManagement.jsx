import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTrophy } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await axios.get('/contests');
      setContests(response.data);
    } catch (error) {
      toast.error('Error fetching contests');
    }
  };

  const handlePublish = async (id, currentStatus) => {
    try {
      await axios.put(`/contests/${id}`, {
        isPublished: !currentStatus
      });
      toast.success(`Contest ${currentStatus ? 'unpublished' : 'published'} successfully`);
      fetchContests();
    } catch (error) {
      toast.error('Error updating contest status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    
    try {
      await axios.delete(`/contests/${id}`);
      toast.success('Contest deleted successfully');
      fetchContests();
    } catch (error) {
      toast.error('Error deleting contest');
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contest Management</h1>
        <button
          onClick={() => navigate('/faculty/contests/create')}
          className={`px-4 py-2 rounded flex items-center gap-2 text-white
            ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          <FaPlus /> Create Contest
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map(contest => (
          <div 
            key={contest._id} 
            className={`rounded-lg shadow-md p-6 transition-colors
              ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className={`text-xl font-semibold mb-2 
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {contest.title}
            </h2>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {contest.description}
            </p>
            
            <div className={`mb-4 space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p><strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
              <p><strong>Duration:</strong> {contest.duration} minutes</p>
              <p><strong>Problems:</strong> {contest.problems.length}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  contest.isPublished 
                    ? isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    : isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {contest.isPublished ? 'Published' : 'Draft'}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/edit`)}
                className={`px-3 py-1 rounded text-white
                  ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handlePublish(contest._id, contest.isPublished)}
                className={`px-3 py-1 rounded text-white ${
                  contest.isPublished 
                    ? isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
                    : isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {contest.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/leaderboard`)}
                className={`px-3 py-1 rounded text-white
                  ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}`}
              >
                <FaTrophy />
              </button>
              <button
                onClick={() => handleDelete(contest._id)}
                className={`px-3 py-1 rounded text-white
                  ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestManagement;