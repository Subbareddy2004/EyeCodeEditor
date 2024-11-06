import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSpinner, FaPlus, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthHeaders } from '../../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateContest = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [availableProblems, setAvailableProblems] = useState([]);
  
  const [contest, setContest] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 120,
    problems: [],
    termsAndConditions: '',
  });

  useEffect(() => {
    fetchProblems();
    if (id) {
      fetchContest();
    }
  }, [id]);

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

  const fetchContest = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/contests/${id}`,
        { headers: getAuthHeaders() }
      );
      const contestData = response.data;
      setContest({
        ...contestData,
        startTime: new Date(contestData.startTime).toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error('Error fetching contest:', error);
      toast.error('Failed to load contest');
      navigate('/faculty/contests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...contest,
        startTime: new Date(contest.startTime).toISOString(),
      };

      if (id) {
        await axios.put(
          `${API_URL}/faculty/contests/${id}`,
          payload,
          { headers: getAuthHeaders() }
        );
        toast.success('Contest updated successfully');
      } else {
        await axios.post(
          `${API_URL}/faculty/contests`,
          payload,
          { headers: getAuthHeaders() }
        );
        toast.success('Contest created successfully');
      }
      navigate('/faculty/contests');
    } catch (error) {
      console.error('Error saving contest:', error);
      toast.error(error.response?.data?.message || 'Failed to save contest');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = () => {
    setContest(prev => ({
      ...prev,
      problems: [...prev.problems, { problem: '', points: 100 }]
    }));
  };

  const handleRemoveProblem = (index) => {
    setContest(prev => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index)
    }));
  };

  const handleProblemChange = (index, field, value) => {
    setContest(prev => ({
      ...prev,
      problems: prev.problems.map((prob, i) => 
        i === index ? { ...prob, [field]: value } : prob
      )
    }));
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {id ? 'Edit Contest' : 'Create New Contest'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-[#242b3d]' : 'bg-white'
          } shadow`}>
            {/* Basic Details */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Title
                </label>
                <input
                  type="text"
                  value={contest.title}
                  onChange={(e) => setContest(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
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
                  value={contest.description}
                  onChange={(e) => setContest(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows="4"
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={contest.startTime}
                    onChange={(e) => setContest(prev => ({
                      ...prev,
                      startTime: e.target.value
                    }))}
                    className={`w-full p-2 rounded border ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
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
                    value={contest.duration}
                    onChange={(e) => setContest(prev => ({
                      ...prev,
                      duration: parseInt(e.target.value)
                    }))}
                    min="1"
                    className={`w-full p-2 rounded border ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Problems Section */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-[#242b3d]' : 'bg-white'
          } shadow`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Problems</h2>
              <button
                type="button"
                onClick={handleAddProblem}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaPlus className="mr-2" /> Add Problem
              </button>
            </div>

            <div className="space-y-4">
              {contest.problems.map((problem, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>Problem {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveProblem(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Select Problem
                      </label>
                      <select
                        value={problem.problem}
                        onChange={(e) => handleProblemChange(index, 'problem', e.target.value)}
                        className={`w-full p-2 rounded border ${
                          darkMode 
                            ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                            : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select a problem</option>
                        {availableProblems.map(prob => (
                          <option key={prob._id} value={prob._id}>
                            {prob.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Points
                      </label>
                      <input
                        type="number"
                        value={problem.points}
                        onChange={(e) => handleProblemChange(index, 'points', parseInt(e.target.value))}
                        min="1"
                        className={`w-full p-2 rounded border ${
                          darkMode 
                            ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                            : 'border-gray-300'
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-[#242b3d]' : 'bg-white'
          } shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Terms and Conditions</h2>
            <textarea
              value={contest.termsAndConditions}
              onChange={(e) => setContest(prev => ({
                ...prev,
                termsAndConditions: e.target.value
              }))}
              rows="6"
              className={`w-full p-2 rounded border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {id ? 'Update Contest' : 'Create Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContest;