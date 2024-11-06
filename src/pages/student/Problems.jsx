import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { getProblems } from '../../services/problemService';
import { toast } from 'react-hot-toast';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const data = await getProblems();
      setProblems(data);
    } catch (error) {
      toast.error('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleSolveProblem = (problemId) => {
    navigate(`/student/practice/${problemId}`);
  };

  // Filter problems based on search query and difficulty
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || 
                             problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Practice Problems
          </h1>

          {/* Search and Filter Controls */}
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full md:w-64 pl-10 pr-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className={`w-full md:w-48 pl-4 pr-8 py-2 rounded-lg appearance-none ${
                  darkMode 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className={`animate-spin text-3xl ${darkMode ? 'text-white' : 'text-gray-800'}`} />
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredProblems.length} of {problems.length} problems
            </p>

            {/* Problems Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((problem) => (
                <div
                  key={problem._id}
                  className={`rounded-lg shadow-md p-6 transition-transform hover:scale-105 ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      problem.difficulty === 'Easy' 
                        ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        : problem.difficulty === 'Medium'
                        ? darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {problem.description}
                  </p>
                  <button
                    onClick={() => handleSolveProblem(problem._id)}
                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaCode className="mr-2" />
                    Solve Problem
                  </button>
                </div>
              ))}
            </div>

            {/* No results message */}
            {filteredProblems.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No problems found matching your criteria
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Problems;
