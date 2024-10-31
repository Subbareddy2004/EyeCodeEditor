import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaTag } from 'react-icons/fa';
import ProblemSolver from '../../components/ProblemSolver';
import { getProblems } from '../../services/problems';
import { useTheme } from '../../contexts/ThemeContext';

const Problems = () => {
  const { darkMode } = useTheme();
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const problemsData = await getProblems();
        const sanitizedProblems = problemsData.map(problem => ({
          _id: problem._id,
          title: problem.title,
          difficulty: problem.difficulty,
          acceptance: problem.acceptance || 0,
          tags: problem.tags || [],
          createdBy: problem.createdBy
        }));
        setProblems(sanitizedProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-blue-400' : 'border-indigo-500'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${darkMode ? 'text-red-400' : 'text-red-600'} mt-8`}>
        <p>{error}</p>
      </div>
    );
  }

  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (difficultyFilter === 'All' || problem.difficulty === difficultyFilter)
  );

  return (
    <div className={`${darkMode ? 'bg-[#1a1f2c]' : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>Problems</h1>
        
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search problems..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-[#242b3d] border-[#2d3548] text-white placeholder-gray-400 focus:ring-blue-500' 
                  : 'bg-white border-indigo-300 focus:ring-indigo-500'
              } border focus:outline-none focus:ring-2`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-indigo-400'}`} />
          </div>
          
          <select
            className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-[#242b3d] border-[#2d3548] text-white focus:ring-blue-500' 
                : 'bg-white border-indigo-300 text-indigo-800 focus:ring-indigo-500'
            }`}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className={`${darkMode ? 'bg-[#242b3d] shadow-xl' : 'bg-white shadow-lg'} rounded-lg overflow-hidden`}>
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-[#1a1f2c]' : 'bg-indigo-600'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acceptance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-[#242b3d] divide-[#2d3548]' : 'bg-white divide-indigo-200'} divide-y`}>
              {filteredProblems.map((problem) => (
                <tr key={problem._id} className={darkMode ? 'hover:bg-[#2d3548]' : 'hover:bg-indigo-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedProblemId(problem._id)}
                      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-900'} font-medium`}
                    >
                      {problem.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      darkMode ? (
                        problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800' :
                        'bg-red-900/50 text-red-300 border border-red-800'
                      ) : (
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {problem.acceptance || 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {(problem.tags || []).map((tag, index) => (
                      <span 
                        key={index} 
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                          darkMode 
                            ? 'bg-[#1a1f2c] text-blue-300 border border-[#2d3548]' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        <FaTag className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedProblemId && (
        <ProblemSolver
          problemId={selectedProblemId}
          onClose={() => setSelectedProblemId(null)}
        />
      )}
    </div>
  );
};

export default Problems;
