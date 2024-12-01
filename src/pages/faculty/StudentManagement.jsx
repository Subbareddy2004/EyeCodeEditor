// client/src/pages/faculty/StudentManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useTheme();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/faculty/students`,
        { headers: getAuthHeaders() }
      );
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-100'}`}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Student Management
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          View and manage student information
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className={`relative max-w-md ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <input
            type="text"
            placeholder="Search by name, email, or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-[#242b3d] border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table Section */}
      <div className={`overflow-x-auto rounded-lg shadow ${
        darkMode ? 'bg-[#242b3d]' : 'bg-white'
      }`}>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : (
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-[#2d3548]' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Registration Number
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student._id} 
                  className={`hover:${darkMode ? 'bg-[#1f2937]' : 'bg-gray-50'} transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.regNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* No Results Message */}
        {!loading && filteredStudents.length === 0 && (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No students found matching your search criteria.
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
};

export default StudentManagement;