import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaFileUpload, FaTrash, FaEdit } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const StudentManagement = () => {
  const { darkMode } = useTheme();
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [file, setFile] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Fetch faculties on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get('/admin/faculties');
      setFaculties(response.data);
    } catch (error) {
      toast.error('Error fetching faculties');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) {
      toast.error('Please select a faculty');
      return;
    }

    try {
      await axios.post(`/admin/faculty/${selectedFaculty}/students`, {
        ...newStudent
      });
      toast.success('Student added successfully');
      setNewStudent({ name: '', email: '', password: '' });
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding student');
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFaculty || !file) {
      toast.error('Please select a faculty and file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`/admin/faculty/${selectedFaculty}/students/bulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Students uploaded successfully');
      setFile(null);
      fetchStudents();
    } catch (error) {
      toast.error('Error uploading students');
    }
  };

  const fetchStudents = async () => {
    if (!selectedFaculty) return;
    
    try {
      const response = await axios.get(`/admin/faculty/${selectedFaculty}/students`);
      setStudents(response.data);
    } catch (error) {
      toast.error('Error fetching students');
    }
  };

  useEffect(() => {
    if (selectedFaculty) {
      fetchStudents();
    }
  }, [selectedFaculty]);

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-6">Student Management</h2>

      {/* Faculty Selection */}
      <div className="mb-6">
        <label className="block mb-2">Select Faculty</label>
        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className={`w-full p-2 rounded ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          <option value="">Select a faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty._id} value={faculty._id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      {selectedFaculty && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaUserPlus /> Add Student
            </button>
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaFileUpload /> Select File
              </label>
              {file && (
                <button
                  onClick={handleBulkUpload}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Upload Students
                </button>
              )}
            </div>
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <form onSubmit={handleAddStudent} className="space-y-4 p-4 border rounded">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Students List */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Students</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-1 text-blue-500 hover:text-blue-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="p-1 text-red-500 hover:text-red-600"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement; 