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
  const { darkMode } = useTheme();

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

  const handleProblemComplete = async (contestId, problemId, code) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contests/${contestId}/problems/${problemId}/complete`,
        {
          code,
          problemId
        },
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        toast.success('Problem completed successfully!');
        // Refresh contest data
        await fetchContests();
      } else {
        toast.error(response.data.message || 'Failed to complete problem');
      }
    } catch (error) {
      console.error('Error completing problem:', error);
      toast.error(error.response?.data?.message || 'Error completing problem');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center justify-center h-64">
          <FaSpinner className={`text-4xl animate-spin mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Loading Contests...
          </p>
        </div>
        
        {/* Skeleton Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`rounded-lg shadow-md p-6 ${
                darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
              } animate-pulse`}
            >
              <div className={`h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
              <div className="space-y-3">
                <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
                <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
                <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-4/6`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Contest Management
        </h1>
        <button
          onClick={() => navigate('/faculty/contests/create')}
          className={`px-4 py-2 rounded flex items-center gap-2 text-white
            ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          <FaPlus /> Create Contest
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map(contest => (
          <div 
            key={contest._id} 
            className={`rounded-lg shadow-md p-6 transition-colors relative
              ${darkMode 
                ? 'bg-[#242b3d] border border-[#2d3548] hover:bg-[#2d3548]' 
                : 'bg-white hover:bg-gray-50'}`}
          >
            {/* Loading Overlay */}
            {actionLoading === contest._id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                <FaSpinner className="text-white text-2xl animate-spin" />
              </div>
            )}

            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {contest.title}
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {contest.description}
            </p>
            
            <div className={`mb-4 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p><strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
              <p><strong>Duration:</strong> {contest.duration} minutes</p>
              <p><strong>Problems:</strong> {contest.problems.length}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  contest.isPublished 
                    ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    : darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {contest.isPublished ? 'Published' : 'Draft'}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/edit`)}
                disabled={actionLoading === contest._id}
                className={`p-2 rounded text-white transition-colors
                  ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handlePublish(contest._id, contest.isPublished)}
                disabled={actionLoading === contest._id}
                className={`p-2 rounded text-white transition-colors
                  ${darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {contest.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/leaderboard`)}
                disabled={actionLoading === contest._id}
                className={`p-2 rounded text-white transition-colors
                  ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}
                  ${actionLoading === contest._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaTrophy />
              </button>
              <button
                onClick={() => handleDelete(contest._id)}
                disabled={actionLoading === contest._id}
                className={`p-2 rounded text-white transition-colors
                  ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}
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