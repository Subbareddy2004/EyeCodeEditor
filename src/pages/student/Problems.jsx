import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaTag } from 'react-icons/fa';
import ProblemSolver from '../../components/ProblemSolver';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  useEffect(() => {
    // Simulating API call
    setProblems([
      { id: '1', title: 'Two Sum', difficulty: 'Easy', acceptance: 45, tags: ['Array', 'Hash Table'] },
      { id: '2', title: 'Reverse Linked List', difficulty: 'Medium', acceptance: 62, tags: ['Linked List'] },
      { id: '3', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', acceptance: 35, tags: ['Tree', 'DFS'] },
      { id: '4', title: 'Valid Parentheses', difficulty: 'Easy', acceptance: 39, tags: ['Stack', 'String'] },
      { id: '5', title: 'Merge K Sorted Lists', difficulty: 'Hard', acceptance: 41, tags: ['Linked List', 'Divide and Conquer'] },
    ]);
  }, []);

  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (difficultyFilter === 'All' || problem.difficulty === difficultyFilter)
  );

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900">Problems</h1>
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-indigo-400" />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-indigo-800"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acceptance</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-200">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedProblemId(problem.id)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      {problem.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.acceptance}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
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
