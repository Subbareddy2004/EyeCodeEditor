import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { getStudents } from '../../services/studentService';
import { useTheme } from '../../contexts/ThemeContext';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { darkMode } = useTheme();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      const sortedStudents = data.sort((a, b) => (b.score || 0) - (a.score || 0));
      setStudents(sortedStudents);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.regNumber && student.regNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen ${
      darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-800'
    }`}>
      <FaSpinner className="animate-spin text-3xl mr-2" />
      <span>Loading leaderboard...</span>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 text-center">{error}</div>
  );

  return (
    <div className={`min-h-screen p-6 ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <div className={`${
        darkMode 
          ? 'bg-[#242b3d] border border-[#2d3548]' 
          : 'bg-white/80 backdrop-blur-sm'
      } rounded-lg shadow-lg overflow-hidden p-6`}>
        <h1 className={`text-4xl font-bold mb-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Leaderboard</h1>
        
        <div className="mb-6">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search users..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-[#2d3548] text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={`rounded-lg shadow overflow-hidden ${
          darkMode ? 'bg-[#1e2433]' : 'bg-white'
        }`}>
          <table className="min-w-full">
            <thead className={`${
              darkMode ? 'bg-[#2d3548]' : 'bg-purple-600'
            } text-white`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-[#2d3548]' : 'divide-gray-200'
            }`}>
              {filteredStudents.map((student, index) => (
                <tr key={student._id} className={
                  darkMode ? 'hover:bg-[#2d3548]' : 'hover:bg-gray-50'
                }>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    <div className="text-sm font-medium">
                      {index + 1}
                      {index < 3 && " 🏆"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full ${
                          darkMode ? 'bg-purple-900' : 'bg-purple-100'
                        } flex items-center justify-center ${
                          darkMode ? 'text-purple-200' : 'text-purple-700'
                        }`}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {student.name}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {student.score || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;