import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

const ContestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 60,
    problems: []
  });
  const [availableProblems, setAvailableProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
    if (id) {
      fetchContest();
    }
  }, [id]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/problems');
      setAvailableProblems(response.data);
    } catch (error) {
      toast.error('Error fetching problems');
    }
  };

  const fetchContest = async () => {
    try {
      const response = await axios.get(`/contests/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        startTime: new Date(response.data.startTime).toISOString().slice(0, 16),
        duration: response.data.duration,
        problems: response.data.problems
      });
    } catch (error) {
      toast.error('Error fetching contest');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/contests/${id}`, formData);
        toast.success('Contest updated successfully');
      } else {
        await axios.post('/contests', formData);
        toast.success('Contest created successfully');
      }
      navigate('/faculty/contests');
    } catch (error) {
      toast.error('Error saving contest');
    }
  };

  const handleProblemAdd = (problemId) => {
    setFormData(prev => ({
      ...prev,
      problems: [...prev.problems, { problemId, points: 100 }]
    }));
  };

  const handleProblemRemove = (problemId) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.filter(p => p.problemId !== problemId)
    }));
  };

  return (
    <div className={`min-h-screen p-6 ${
      darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`max-w-4xl mx-auto rounded-lg shadow-md p-6 ${
        darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
      }`}>
        <h1 className={`text-2xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {id ? 'Edit Contest' : 'Create Contest'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block mb-2 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                title: e.target.value
              }))}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
              } focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
              required
            />
          </div>

          <div>
            <label className={`block mb-2 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
              } focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
              rows="4"
              required
            />
          </div>

          <div>
            <label className={`block mb-2 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Start Time
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                startTime: e.target.value
              }))}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
              } focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
              required
            />
          </div>

          <div>
            <label className={`block mb-2 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                duration: parseInt(e.target.value)
              }))}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
              } focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
              min="1"
              required
            />
          </div>

          <div>
            <label className={`block mb-2 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Problems
            </label>
            <div className="space-y-4">
              {formData.problems.map(problem => (
                <div key={problem.problemId} className={`flex items-center space-x-4 p-3 rounded-md ${
                  darkMode ? 'bg-[#1a1f2c] border border-[#2d3548]' : 'bg-gray-50'
                }`}>
                  <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                    {availableProblems.find(p => p._id === problem.problemId)?.title}
                  </span>
                  <input
                    type="number"
                    value={problem.points}
                    onChange={(e) => {
                      const newProblems = formData.problems.map(p =>
                        p.problemId === problem.problemId
                          ? { ...p, points: parseInt(e.target.value) }
                          : p
                      );
                      setFormData(prev => ({ ...prev, problems: newProblems }));
                    }}
                    className={`w-24 p-2 rounded-md border ${
                      darkMode 
                        ? 'bg-[#242b3d] border-[#2d3548] text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
                    } focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => handleProblemRemove(problem.problemId)}
                    className={`text-red-500 hover:text-red-600 transition-colors ${
                      darkMode ? 'hover:text-red-400' : ''
                    }`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <select
              onChange={(e) => handleProblemAdd(e.target.value)}
              className={`mt-4 w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
              } focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
              value=""
            >
              <option value="">Add a problem...</option>
              {availableProblems
                .filter(p => !formData.problems.find(fp => fp.problemId === p._id))
                .map(problem => (
                  <option key={problem._id} value={problem._id}>
                    {problem.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/faculty/contests')}
              className={`px-4 py-2 rounded-md transition-colors ${
                darkMode 
                  ? 'bg-[#1a1f2c] hover:bg-[#2d3548] text-white border border-[#2d3548]' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {id ? 'Update Contest' : 'Create Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestForm;