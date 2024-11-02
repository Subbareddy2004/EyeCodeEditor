import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditContest = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 0,
    problems: []
  });
  const [availableProblems, setAvailableProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContest();
    fetchProblems();
  }, [id]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/contests/${id}`,
        { headers: getAuthHeaders() }
      );
      const contest = response.data;
      
      // Format the date for the datetime-local input
      const startDateTime = new Date(contest.startTime)
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: contest.title,
        description: contest.description,
        startTime: startDateTime,
        duration: parseInt(contest.duration),
        // Store the full problem objects including their IDs
        problems: contest.problems.map(p => ({
          problem: p.problem._id || p.problem,
          points: p.points
        }))
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contest:', error);
      toast.error('Failed to load contest');
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/problems`,
        { headers: getAuthHeaders() }
      );
      setAvailableProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Failed to load problems');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleCancel = () => {
    navigate('/faculty/contests');
  };

  const handleProblemChange = (problemId) => {
    setFormData(prev => {
      const isSelected = prev.problems.some(p => p.problem === problemId);
      const newProblems = isSelected
        ? prev.problems.filter(p => p.problem !== problemId)
        : [...prev.problems, { problem: problemId, points: 100 }];
      return { ...prev, problems: newProblems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/faculty/contests/${id}`,
        formData,
        { headers: getAuthHeaders() }
      );
      toast.success('Contest updated successfully');
      navigate('/faculty/contests');
    } catch (error) {
      console.error('Error updating contest:', error);
      toast.error('Failed to update contest');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gradient-to-br from-indigo-100 to-blue-200'}`}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Edit Contest
        </h1>

        <form onSubmit={handleSubmit} className={`space-y-6 p-8 rounded-lg shadow-lg ${
          darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
        }`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500 min-h-[100px]`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500`}
              min="1"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Select Problems ({formData.problems.length})
            </label>
            <div className="space-y-2">
              {availableProblems.map(problem => (
                <div
                  key={problem._id}
                  onClick={() => handleProblemChange(problem._id)}
                  className={`flex items-center p-4 rounded-lg cursor-pointer ${
                    darkMode
                      ? formData.problems.some(p => p.problem === problem._id)
                        ? 'bg-blue-900/30 border border-blue-500'
                        : 'bg-[#1a1f2c] border border-gray-700 hover:bg-[#2d3748]'
                      : formData.problems.some(p => p.problem === problem._id)
                        ? 'bg-blue-50 border border-blue-500'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-6 h-6 border rounded-md flex items-center justify-center mr-3 ${
                      darkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      {formData.problems.some(p => p.problem === problem._id) && (
                        <FaCheck className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {problem.title}
                      </div>
                      <div className={`text-sm ${
                        problem.difficulty === 'Easy' ? 'text-green-500' :
                        problem.difficulty === 'Medium' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {problem.difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className={`px-6 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Contest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContest;