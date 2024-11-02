import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, updateProblem } from '../../services/problems';
import { useTheme } from '../../contexts/ThemeContext';

const ProblemEdit = ({ user }) => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    sampleInput: '',
    sampleOutput: '',
    testCases: [{ input: '', output: '' }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      const data = await getProblem(id);
      setProblem(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProblem(id, problem);
      navigate('/faculty/problems');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...problem.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setProblem({ ...problem, testCases: newTestCases });
  };

  const addTestCase = () => {
    setProblem({
      ...problem,
      testCases: [...problem.testCases, { input: '', output: '' }]
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = problem.testCases.filter((_, i) => i !== index);
    setProblem({ ...problem, testCases: newTestCases });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${
        darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
      } rounded-lg shadow-md p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Edit Problem</h1>
          <button
            onClick={() => navigate('/faculty/problems')}
            className={`${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Back to Problems
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Title</label>
              <input
                type="text"
                value={problem.title}
                onChange={(e) => setProblem({ ...problem, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
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
              }`}>Difficulty</label>
              <select
                value={problem.difficulty}
                onChange={(e) => setProblem({ ...problem, difficulty: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  darkMode 
                    ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Description</label>
            <textarea
              value={problem.description}
              onChange={(e) => setProblem({ ...problem, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
              rows="6"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Sample Input</label>
              <textarea
                value={problem.sampleInput}
                onChange={(e) => setProblem({ ...problem, sampleInput: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  darkMode 
                    ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
                rows="4"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Sample Output</label>
              <textarea
                value={problem.sampleOutput}
                onChange={(e) => setProblem({ ...problem, sampleOutput: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  darkMode 
                    ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
                rows="4"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Test Cases</label>
            {problem.testCases.map((testCase, index) => (
              <div key={index} className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-md ${
                darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
              }`}>
                <div>
                  <label className={`block text-xs mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Input</label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      darkMode 
                        ? 'bg-[#242b3d] border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    rows="3"
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Output</label>
                  <textarea
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      darkMode 
                        ? 'bg-[#242b3d] border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    rows="3"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove Test Case
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className={`mt-2 text-sm font-medium ${
                darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-800'
              }`}
            >
              + Add Test Case
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/faculty/problems')}
              className={`px-4 py-2 border rounded-md ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Update Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemEdit;
