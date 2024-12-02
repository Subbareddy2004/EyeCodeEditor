import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTrophy } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const AdminContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      console.log('Fetching contests...');
      const response = await axios.get('/admin/contests');
      console.log('Response:', response.data);
      setContests(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching contests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    
    try {
      await axios.delete(`/admin/contests/${id}`);
      toast.success('Contest deleted successfully');
      fetchContests();
    } catch (error) {
      toast.error('Error deleting contest');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contest Management</h2>
        <button
          onClick={() => navigate('/admin/contests/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus /> Create Contest
        </button>
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-8">
          <p>No contests found. Create your first contest!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className={`p-4 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{contest.title}</h3>
              <p className="text-gray-500 dark:text-gray-300 mb-4">{contest.description}</p>
              
              <div className="flex flex-col space-y-2">
                <div className="text-sm">
                  <p>Start: {new Date(contest.startDate).toLocaleString()}</p>
                  <p>End: {new Date(contest.endDate).toLocaleString()}</p>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/contests/${contest._id}/edit`)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/contests/${contest._id}/leaderboard`)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded"
                    title="Leaderboard"
                  >
                    <FaTrophy />
                  </button>
                  <button
                    onClick={() => handleDelete(contest._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContestManagement; 