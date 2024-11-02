import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { getFacultyProblems } from '../../services/problems';
import { createAssignment, updateAssignment } from '../../services/assignmentService';
import { getAuthHeaders } from '../../utils/authUtils';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssignmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [availableProblems, setAvailableProblems] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    problems: []
  });

  const handleProblemSelection = (problemId) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.includes(problemId)
        ? prev.problems.filter(id => id !== problemId)
        : [...prev.problems, problemId]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch available problems
        const problems = await getFacultyProblems();
        setAvailableProblems(problems);

        // If editing, fetch assignment details
        if (id) {
          const response = await axios.get(
            `${API_URL}/faculty/assignments/${id}`,
            { headers: getAuthHeaders() }
          );
          const assignment = response.data;
          
          // Set form data with existing problems
          setFormData({
            title: assignment.title || '',
            description: assignment.description || '',
            dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
            problems: assignment.problems.map(p => p._id || p) // Handle both populated and unpopulated problems
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateAssignment(id, formData);
        toast.success('Assignment updated successfully');
      } else {
        await createAssignment(formData);
        toast.success('Assignment created successfully');
      }
      navigate('/faculty/assignments');
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error(error.message || 'Failed to save assignment');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {id ? 'Edit Assignment' : 'Create Assignment'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`w-full p-2 rounded border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full p-2 rounded border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
                className={`w-full p-2 rounded border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Select Problems ({formData.problems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProblems.map(problem => (
                <div 
                  key={problem._id}
                  onClick={() => handleProblemSelection(problem._id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.problems.includes(problem._id)
                      ? `${darkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-500'}`
                      : `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`
                  } hover:border-blue-500`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      formData.problems.includes(problem._id)
                        ? 'bg-blue-500 border-blue-500'
                        : darkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      {formData.problems.includes(problem._id) && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {problem.title}
                      </p>
                      <span className={`text-sm ${
                        problem.difficulty === 'Hard'
                          ? 'text-red-500'
                          : problem.difficulty === 'Medium'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/faculty/assignments')}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {id ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssignmentForm;