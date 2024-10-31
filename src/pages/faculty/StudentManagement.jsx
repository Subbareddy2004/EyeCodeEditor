// client/src/pages/faculty/StudentManagement.jsx
import React, { useState, useEffect } from 'react';
import { FaUpload, FaDownload, FaUserGraduate, FaPlus, FaTimes, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { importStudents, getStudents, addStudent, deleteStudent, updateStudent } from '../../services/studentService';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    regNumber: ''
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const result = await addStudent(newStudent);
      toast.success('Student added successfully');
      setStudents([...students, result.student]);
      setShowAddForm(false);
      setNewStudent({ name: '', email: '', regNumber: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const result = await importStudents(formData);
      toast.success(result.message);
      
      // Reload students list
      await loadStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to import students');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = 'name,email,regNumber\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      const result = await updateStudent(editingStudent._id, editingStudent);
      toast.success('Student updated successfully');
      setStudents(students.map(s => 
        s._id === editingStudent._id ? result.student : s
      ));
      setShowEditForm(false);
      setEditingStudent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await deleteStudent(studentId);
      toast.success('Student deleted successfully');
      setStudents(students.filter(s => s._id !== studentId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className={`p-6 min-h-screen ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Student Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaDownload className="mr-2" />
            Download Template
          </button>
          <label className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
            <FaUpload className="mr-2" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            <FaPlus className="mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-md ${
            darkMode ? 'bg-[#242b3d]' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Add New Student</h2>
              <button onClick={() => setShowAddForm(false)} className={`${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className={`w-full p-2 rounded ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className={`w-full p-2 rounded ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Registration Number
                </label>
                <input
                  type="text"
                  value={newStudent.regNumber}
                  onChange={(e) => setNewStudent({...newStudent, regNumber: e.target.value})}
                  className={`w-full p-2 rounded ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
      )}

      {/* Edit Student Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-md ${
            darkMode ? 'bg-[#242b3d]' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Edit Student</h2>
              <button onClick={() => {
                setShowEditForm(false);
                setEditingStudent(null);
              }} className={`${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditStudent}>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name
                </label>
                <input
                  type="text"
                  value={editingStudent?.name || ''}
                  onChange={(e) => setEditingStudent({
                    ...editingStudent,
                    name: e.target.value
                  })}
                  className={`w-full p-2 rounded ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={editingStudent?.email || ''}
                  onChange={(e) => setEditingStudent({
                    ...editingStudent,
                    email: e.target.value
                  })}
                  className={`w-full p-2 rounded ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Registration Number
                </label>
                <input
                  type="text"
                  value={editingStudent?.regNumber || ''}
                  onChange={(e) => setEditingStudent({
                    ...editingStudent,
                    regNumber: e.target.value
                  })}
                  className={`w-full p-2 rounded ${
                    darkMode 
                      ? 'bg-[#1a1f2c] border-[#2d3548] text-white' 
                      : 'border-gray-300 text-gray-900'
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
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className={`flex justify-center items-center py-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <FaSpinner className="animate-spin text-3xl mr-2" />
          <span>Loading students...</span>
        </div>
      ) : (
        <div className={`rounded-lg shadow overflow-hidden ${
          darkMode ? 'bg-[#242b3d]' : 'bg-white'
        }`}>
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-[#1e2433]' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Email
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Registration Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-[#2d3548] bg-[#242b3d]' : 'divide-gray-200 bg-white'
            }`}>
              {students.map((student) => (
                <tr key={student._id} className={
                  darkMode ? 'hover:bg-[#2d3548]' : 'hover:bg-gray-50'
                }>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUserGraduate className={`mr-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {student.name}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {student.email}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {student.regNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setShowEditForm(true);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;