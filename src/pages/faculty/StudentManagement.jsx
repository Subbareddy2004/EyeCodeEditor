// client/src/pages/faculty/StudentManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUserPlus, 
  FaFileUpload, 
  FaDownload,
  FaTimes,
  FaEdit,
  FaTrash,
  FaKey
} from 'react-icons/fa';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';

// Move AddStudentForm outside the main component
const AddStudentForm = ({ onSubmit, onClose, newStudent, setNewStudent, darkMode }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className={`${
      darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
    } rounded-lg p-6 w-full max-w-md`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Add New Student</h2>
        <button onClick={onClose} className={`${
          darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
        }`}>
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Name</label>
          <input
            type="text"
            name="name"
            value={newStudent.name}
            onChange={(e) => setNewStudent(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className={`w-full p-2 border rounded ${
              darkMode 
                ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Email</label>
          <input
            type="email"
            name="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent(prev => ({
              ...prev,
              email: e.target.value
            }))}
            className={`w-full p-2 border rounded ${
              darkMode 
                ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Registration Number</label>
          <input
            type="text"
            name="regNumber"
            value={newStudent.regNumber}
            onChange={(e) => setNewStudent(prev => ({
              ...prev,
              regNumber: e.target.value
            }))}
            className={`w-full p-2 border rounded ${
              darkMode 
                ? 'bg-[#1a1f2c] border-gray-600 text-white focus:border-blue-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  </div>
);

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    regNumber: ''
  });
  const { darkMode } = useTheme();

  const fetchStudents = async () => {
    try {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/faculty/students`,
        newStudent,
        { headers: getAuthHeaders() }
      );
      
      toast.success(
        `Student added successfully! Initial password: ${response.data.student.initialPassword}`,
        { duration: 10000 }
      );
      
      setShowAddForm(false);
      setNewStudent({ name: '', email: '', regNumber: '' });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding student');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/faculty/students/import`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(
        `${response.data.count} students imported successfully! Check the console for passwords.`,
        { duration: 10000 }
      );
      
      console.table(response.data.students.map(s => ({
        name: s.name,
        email: s.email,
        password: s.initialPassword
      })));

      fetchStudents();
    } catch (error) {
      toast.error('Error importing students');
    }
  };

  const handleResetPassword = async (studentId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/faculty/students/${studentId}/reset-password`,
        {},
        { headers: getAuthHeaders() }
      );
      
      toast.success(
        `Password reset successfully! New password: ${response.data.initialPassword}`,
        { duration: 10000 }
      );
    } catch (error) {
      toast.error('Error resetting password');
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV content
    const csvContent = "name,email,regNumber\nJohn Doe,john@example.com,REG001\n";
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Add table to display students
  const renderStudentsTable = () => (
    <div className={`rounded-lg shadow overflow-hidden ${
      darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
    }`}>
      <table className="min-w-full">
        <thead className={`${
          darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
        }`}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Name</th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Email</th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Reg Number</th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Actions</th>
          </tr>
        </thead>
        <tbody className={`${
          darkMode ? 'divide-gray-700' : 'divide-gray-200'
        }`}>
          {students.map((student) => (
            <tr key={student._id} className={
              darkMode ? 'hover:bg-[#1a1f2c]' : 'hover:bg-gray-50'
            }>
              <td className={`px-6 py-4 whitespace-nowrap ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{student.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{student.email}</td>
              <td className={`px-6 py-4 whitespace-nowrap ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{student.regNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  onClick={() => handleResetPassword(student._id)}
                  className={`${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'
                  } mr-3`}
                  title="Reset Password"
                >
                  <FaKey />
                </button>
                <button className={`${
                  darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'
                } mr-3`}>
                  <FaEdit />
                </button>
                <button className={`${
                  darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                }`}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaDownload className="mr-2" />
            Download Template
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            <FaUserPlus className="mr-2" />
            Add Student
          </button>
          <label className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
            <FaFileUpload className="mr-2" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {showAddForm && (
        <AddStudentForm
          onSubmit={handleAddStudent}
          onClose={() => setShowAddForm(false)}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          darkMode={darkMode}
        />
      )}

      {students.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-6">No students found. Add some students to get started.</p>
        </div>
      ) : (
        renderStudentsTable()
      )}
    </div>
  );
};

export default StudentManagement;