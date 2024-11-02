import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContest } from '../../services/contestService';
import { getFacultyProblems } from '../../services/problemService';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';

const CreateContest = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: '',
    problems: []
  });
  const [problemPoints, setProblemPoints] = useState({});
  const [availableProblems, setAvailableProblems] = useState([]);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const problems = await getFacultyProblems();
      setAvailableProblems(problems);
    } catch (error) {
      toast.error('Failed to load problems');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProblemSelection = (problemId) => {
    setFormData(prev => {
      const problems = prev.problems.includes(problemId)
        ? prev.problems.filter(id => id !== problemId)
        : [...prev.problems, problemId];
      
      if (!prev.problems.includes(problemId)) {
        setProblemPoints(prevPoints => ({
          ...prevPoints,
          [problemId]: 100
        }));
      }
      
      return { ...prev, problems };
    });
  };

  const handlePointsChange = (problemId, points) => {
    setProblemPoints(prev => ({
      ...prev,
      [problemId]: parseInt(points) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contestData = {
        ...formData,
        problems: formData.problems.map(problemId => ({
          problem: problemId,
          points: problemPoints[problemId] || 0
        }))
      };
      await createContest(contestData);
      toast.success('Contest created successfully');
      navigate('/faculty/contests');
    } catch (error) {
      toast.error('Failed to create contest');
    }
  };

  return (
    <div className={`max-w-3xl mx-auto ${
      darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
    } p-8 rounded-lg shadow-md`}>
      <h2 className={`text-3xl font-bold text-center mb-8 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Create New Contest</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                : 'border-gray-300 text-gray-900'
            }`}
            required
            placeholder="Enter contest title"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 h-32 ${
              darkMode 
                ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                : 'border-gray-300 text-gray-900'
            }`}
            required
            placeholder="Enter contest description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              required
              min="1"
              placeholder="Enter duration in minutes"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Problems</label>
          <div className={`border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto ${
            darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            {availableProblems.map(problem => (
              <div 
                key={problem._id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  formData.problems.includes(problem._id)
                    ? darkMode 
                      ? 'bg-blue-900/30 border border-blue-800'
                      : 'bg-blue-50 border border-blue-200'
                    : `border border-transparent ${
                      darkMode 
                        ? 'hover:bg-[#1a1f2c]' 
                        : 'hover:bg-gray-50'
                    }`
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.problems.includes(problem._id)}
                    onChange={() => handleProblemSelection(problem._id)}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <div>
                    <h3 className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>{problem.title}</h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Difficulty: {problem.difficulty}</p>
                  </div>
                </div>
                {formData.problems.includes(problem._id) && (
                  <div className="flex items-center space-x-2">
                    <label className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Points:</label>
                    <input
                      type="number"
                      value={problemPoints[problem._id] || 0}
                      onChange={(e) => handlePointsChange(problem._id, e.target.value)}
                      className={`w-20 p-1 border rounded-md ${
                        darkMode 
                          ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {formData.problems.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select at least one problem</p>
          )}
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate('/faculty/contests')}
            className={`px-6 py-2 border rounded-md ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={formData.problems.length === 0}
          >
            Create Contest
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContest;