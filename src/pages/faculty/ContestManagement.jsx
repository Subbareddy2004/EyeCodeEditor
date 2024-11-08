import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTrophy } from 'react-icons/fa';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contest Management</h1>
        <button
          onClick={() => navigate('/faculty/contests/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> Create Contest
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map(contest => (
          <div key={contest._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{contest.title}</h2>
            <p className="text-gray-600 mb-4">{contest.description}</p>
            
            <div className="mb-4">
              <p><strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
              <p><strong>Duration:</strong> {contest.duration} minutes</p>
              <p><strong>Problems:</strong> {contest.problems.length}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  contest.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {contest.isPublished ? 'Published' : 'Draft'}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/edit`)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handlePublish(contest._id, contest.isPublished)}
                className={`px-3 py-1 rounded text-white ${
                  contest.isPublished ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {contest.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => navigate(`/faculty/contests/${contest._id}/leaderboard`)}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
              >
                <FaTrophy />
              </button>
              <button
                onClick={() => handleDelete(contest._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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