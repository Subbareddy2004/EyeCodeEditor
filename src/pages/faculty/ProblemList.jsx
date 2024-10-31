import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFacultyProblems, deleteProblem } from '../../services/problems';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSpinner } from 'react-icons/fa';

const ProblemList = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { darkMode } = useTheme();

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await getFacultyProblems();
      setProblems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await deleteProblem(id);
        setProblems(problems.filter(p => p._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          My Problems
        </h1>
        <Link
          to="/faculty/problems/create"
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
        >
          Create New Problem
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className={`flex justify-center items-center py-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <FaSpinner className="animate-spin text-3xl mr-2" />
          <span>Loading problems...</span>
        </div>
      ) : (
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } rounded-lg shadow overflow-hidden`}>
          <table className={`min-w-full divide-y ${darkMode ? 'divide-[#2d3548]' : 'divide-gray-200'}`}>
            <thead className={darkMode ? 'bg-[#1e2433]' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Title
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Difficulty
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Created At
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-[#2d3548]' : 'divide-gray-200'}`}>
              {problems.map((problem) => (
                <tr key={problem._id} className={darkMode ? 'hover:bg-[#2d3548]' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {problem.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-800'
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/faculty/problems/edit/${problem._id}`}
                      className="text-teal-500 hover:text-teal-600 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProblemList;