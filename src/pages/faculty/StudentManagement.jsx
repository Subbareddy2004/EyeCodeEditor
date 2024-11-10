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
  FaKey,
  FaSpinner
} from 'react-icons/fa';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';

// Move AddStudentForm outside the main component
const AddStudentForm = ({ onSubmit, onClose, newStudent, setNewStudent, darkMode }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className={`${
      darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
    } rounded-lg p-4 sm:p-6 w-full max-w-md mx-4`}>
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

  const [actionLoading, setActionLoading] = useState('');

  const handleResetPassword = async (studentId) => {
    setActionLoading(`reset-${studentId}`);
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
    } finally {
      setActionLoading('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setActionLoading('upload');
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
    } finally {
      setActionLoading('');
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

  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      email: student.email,
      regNumber: student.regNumber
    });
    setShowEditForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    setActionLoading(`delete-${studentId}`);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/faculty/students/${studentId}`,
        { headers: getAuthHeaders() }
      );
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Error deleting student');
    } finally {
      setActionLoading('');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(`edit-${editingStudent._id}`);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/faculty/students/${editingStudent._id}`,
        newStudent,
        { headers: getAuthHeaders() }
      );
      
      toast.success('Student updated successfully');
      setShowEditForm(false);
      setEditingStudent(null);
      setNewStudent({ name: '', email: '', regNumber: '' });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating student');
    } finally {
      setActionLoading('');
    }
  };

  // Add this component for the edit form
  const EditStudentForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${
        darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
      } rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Edit Student</h2>
          <button 
            onClick={() => {
              setShowEditForm(false);
              setEditingStudent(null);
            }} 
            className={`${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-bold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Name</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className={`w-full p-2 border rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300'
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
              value={newStudent.email}
              onChange={(e) => setNewStudent(prev => ({
                ...prev,
                email: e.target.value
              }))}
              className={`w-full p-2 border rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300'
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
              value={newStudent.regNumber}
              onChange={(e) => setNewStudent(prev => ({
                ...prev,
                regNumber: e.target.value
              }))}
              className={`w-full p-2 border rounded ${
                darkMode 
                  ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowEditForm(false);
                setEditingStudent(null);
              }}
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
              disabled={actionLoading === `edit-${editingStudent?._id}`}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              {actionLoading === `edit-${editingStudent?._id}` ? 'Updating...' : 'Update Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add table to display students
  const renderStudentsTable = () => (
    <div className="overflow-x-auto">
      <div className={`rounded-lg shadow ${
        darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'
      } min-w-full`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Name</th>
              <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reg Number</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {students.map((student) => (
              <tr key={student._id} className={darkMode ? 'hover:bg-[#1a1f2c]' : 'hover:bg-gray-50'}>
                <td className={`px-4 sm:px-6 py-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <div className="flex flex-col sm:hidden">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-sm text-gray-500 mt-1">{student.email}</span>
                    <span className="text-sm text-gray-500">{student.regNumber}</span>
                  </div>
                  <span className="hidden sm:block">{student.name}</span>
                </td>
                <td className="hidden sm:table-cell px-4 sm:px-6 py-4">{student.email}</td>
                <td className="hidden md:table-cell px-4 sm:px-6 py-4">{student.regNumber}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right sm:text-left">
                  <div className="flex justify-end sm:justify-start space-x-3">
                    <button 
                      onClick={() => handleResetPassword(student._id)}
                      disabled={actionLoading === `reset-${student._id}`}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                    >
                      {actionLoading === `reset-${student._id}` ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaKey />
                      )}
                    </button>
                    <button 
                      onClick={() => handleEdit(student)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(student._id)}
                      disabled={actionLoading === `delete-${student._id}`}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {actionLoading === `delete-${student._id}` ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen ${
        darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-800'
      }`}>
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <span className="text-lg">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className={`text-xl sm:text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Student Management</h1>
        
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={handleDownloadTemplate}
            disabled={actionLoading === 'download'}
            className="flex items-center px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {actionLoading === 'download' ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaDownload className="mr-2" />
            )}
            <span className="hidden sm:inline">Download Template</span>
            <span className="sm:hidden">Template</span>
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-3 sm:px-4 py-2 bg-indigo-500 text-white text-sm sm:text-base rounded hover:bg-indigo-600"
          >
            <FaUserPlus className="mr-2" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </button>
          
          <label className="flex items-center px-3 sm:px-4 py-2 bg-green-500 text-white text-sm sm:text-base rounded hover:bg-green-600 cursor-pointer">
            <FaFileUpload className="mr-2" />
            <span className="hidden sm:inline">Import CSV</span>
            <span className="sm:hidden">Import</span>
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

      {showEditForm && <EditStudentForm />}

      {students.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-base sm:text-xl mb-6">No students found. Add some students to get started.</p>
        </div>
      ) : (
        renderStudentsTable()
      )}
    </div>
  );
};

export default StudentManagement;