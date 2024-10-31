import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaClipboardCheck } from 'react-icons/fa';
import ProblemSolver from '../../components/ProblemSolver';
import { getAssignments } from '../../services/assignmentService';
import { useTheme } from '../../contexts/ThemeContext';

const Assignments = () => {
  const { darkMode } = useTheme();
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const assignmentsData = await getAssignments();
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Failed to load assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
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

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${darkMode ? 'bg-[#1a1f2c]' : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>Assignments</h1>
        
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search assignments..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-[#242b3d] border-[#2d3548] text-white placeholder-gray-400 focus:ring-blue-500' 
                : 'bg-white border-indigo-300 focus:ring-indigo-500'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-indigo-400'}`} />
        </div>

        <div className={`${darkMode ? 'bg-[#242b3d] shadow-xl' : 'bg-white shadow-lg'} rounded-lg overflow-hidden`}>
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-[#1a1f2c]' : 'bg-indigo-600'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Problems</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-[#242b3d] divide-[#2d3548]' : 'bg-white divide-indigo-200'} divide-y`}>
              {filteredAssignments.map((assignment) => (
                <tr key={assignment._id} className={darkMode ? 'hover:bg-[#2d3548]' : 'hover:bg-indigo-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-900'}`}>
                      {assignment.title}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    <FaCalendarAlt className="inline mr-2" />
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      darkMode ? (
                        assignment.status === 'Completed' 
                          ? 'bg-green-900/50 text-green-300 border border-green-800'
                          : 'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                      ) : (
                        assignment.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      )
                    }`}>
                      <FaClipboardCheck className="mr-1" />
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.problems.map((problem) => (
                      <button
                        key={problem._id}
                        onClick={() => setSelectedProblemId(problem._id)}
                        className={`mr-2 px-2 py-1 rounded ${
                          darkMode 
                            ? 'bg-[#1a1f2c] text-blue-300 border border-[#2d3548] hover:bg-[#2d3548]' 
                            : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                        }`}
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
