import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUserGraduate, FaChalkboardTeacher, FaSearch } from 'react-icons/fa';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';
import Loader from '../../components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Students = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchFacultyStudents();
  }, []);

  const fetchFacultyStudents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/faculty-students`,
        { headers: getAuthHeaders() }
      );
      setFacultyData(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacultyData = facultyData.map(faculty => ({
    ...faculty,
    students: faculty.students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(faculty => faculty.students.length > 0);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Students by Faculty
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <FaSearch className={`absolute left-3 top-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size="large" />
            <p className={`mt-4 text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Loading students...
            </p>
          </div>
        ) : facultyData.length === 0 ? (
          <div className={`text-center py-20 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <FaChalkboardTeacher className="mx-auto text-5xl mb-4 opacity-50" />
            <p className="text-xl">No faculty members found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFacultyData.map(faculty => (
              <div key={faculty._id} className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-md overflow-hidden`}>
                <div className={`p-4 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } border-b ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <FaChalkboardTeacher className="text-blue-500" />
                    <h2 className="text-lg font-semibold">{faculty.name}</h2>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      ({faculty.email})
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Reg Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Joined Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    } divide-y ${
                      darkMode ? 'divide-gray-700' : 'divide-gray-200'
                    }`}>
                      {faculty.students.map(student => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FaUserGraduate className="text-blue-500 mr-2" />
                              {student.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.regNumber || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {filteredFacultyData.length === 0 && (
              <div className={`text-center py-8 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No students found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students; 