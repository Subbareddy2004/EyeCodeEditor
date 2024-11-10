import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFacultyProblems, deleteProblem } from '../../services/problems';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';

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

  const renderMobileCard = (problem) => (
    <div 
      key={problem._id} 
      className={`mb-4 p-4 rounded-lg ${
        darkMode 
          ? 'bg-[#242b3d] border border-[#2d3548]' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="flex flex-col space-y-3">
        <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {problem.title}
        </div>
        
        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              problem.difficulty === 'Easy'
                ? 'bg-green-100 text-green-800'
                : problem.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {problem.difficulty}
          </span>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {new Date(problem.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex justify-end space-x-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/faculty/problems/edit/${problem._id}`}
            className="flex items-center text-teal-500 hover:text-teal-600"
          >
            <FaEdit className="mr-1" />
            Edit
          </Link>
          <button
            onClick={() => handleDelete(problem._id)}
            className="flex items-center text-red-500 hover:text-red-600"
          >
            <FaTrash className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          My Problems
        </h1>
        <Link
          to="/faculty/problems/create"
          className="w-full sm:w-auto bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition text-center"
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
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <div className={`rounded-lg shadow ${
              darkMode 
                ? 'bg-[#242b3d] border border-[#2d3548]' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {problems.map(renderMobileCard)}
          </div>

          {/* Empty State */}
          {problems.length === 0 && (
            <div className="text-center py-8">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No problems found. Create your first problem to get started.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProblemList;