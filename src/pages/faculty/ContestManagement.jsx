import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTrophy, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(''); // For individual contest actions
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/contests');
      setContests(response.data);
    } catch (error) {
      toast.error('Error fetching contests');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id, currentStatus) => {
    try {
      setActionLoading(id);
      await axios.put(`/contests/${id}`, {
        isPublished: !currentStatus
      });
      toast.success(`Contest ${currentStatus ? 'unpublished' : 'published'} successfully`);
      await fetchContests();
    } catch (error) {
      toast.error('Error updating contest status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    
    try {
      setActionLoading(id);
      await axios.delete(`/contests/${id}`);
      toast.success('Contest deleted successfully');
      await fetchContests();
    } catch (error) {
      toast.error('Error deleting contest');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center justify-center h-64">
          <FaSpinner className={`text-4xl animate-spin mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Loading Contests...
          </p>
        </div>
        
        {/* Skeleton Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} animate-pulse`}
            >
              <div className="h-6 bg-gray-400 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-400 rounded w-full"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                <div className="h-4 bg-gray-400 rounded w-4/6"></div>
              </div>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4].map((btn) => (
                  <div key={btn} className="h-8 w-8 bg-gray-400 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            className={`rounded-lg shadow-md p-6 transition-colors relative
              ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            {/* Loading Overlay */}
            {actionLoading === contest._id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                <FaSpinner className="text-white text-2xl animate-spin" />
              </div>
            )}

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
                disabled={actionLoading === contest._id}
                className={`px-3 py-1 rounded text-white transition-colors
                  ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handlePublish(contest._id, contest.isPublished)}
                disabled={actionLoading === contest._id}
                className={`px-3 py-1 rounded text-white transition-colors
                  ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {contest.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/leaderboard`)}
                disabled={actionLoading === contest._id}
                className={`px-3 py-1 rounded text-white transition-colors
                  ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaTrophy />
              </button>
              <button
                onClick={() => handleDelete(contest._id)}
                disabled={actionLoading === contest._id}
                className={`px-3 py-1 rounded text-white transition-colors
                  ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
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

// Add these styles to your CSS
const styles = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

export default ContestManagement;