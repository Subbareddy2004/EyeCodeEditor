import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardCheck, FaSearch } from 'react-icons/fa';
import ProblemSolver from '../../components/ProblemSolver';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  useEffect(() => {
    // Simulating API call
    setAssignments([
      { id: '1', title: 'Array Manipulation', dueDate: '2023-05-19T23:59:59Z', status: 'Pending', problems: [{ id: '1', title: 'Problem 1' }, { id: '2', title: 'Problem 2' }] },
      { id: '2', title: 'Dynamic Programming Basics', dueDate: '2023-05-23T23:59:59Z', status: 'Completed', problems: [{ id: '3', title: 'Problem 3' }] },
      { id: '3', title: 'Graph Algorithms', dueDate: '2023-05-25T23:59:59Z', status: 'Pending', problems: [{ id: '4', title: 'Problem 4' }, { id: '5', title: 'Problem 5' }] },
    ]);
  }, []);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900">Assignments</h1>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-indigo-400" />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Problems</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-indigo-600 hover:text-indigo-900">{assignment.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <FaCalendarAlt className="inline mr-2" />
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${assignment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      <FaClipboardCheck className="mr-1" />
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.problems.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => setSelectedProblemId(problem.id)}
                        className="mr-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                      >
                        {problem.title}
                      </button>
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

export default Assignments;
