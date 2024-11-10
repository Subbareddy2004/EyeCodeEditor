import React, { useState, useEffect } from 'react';
import { getFacultyList, addFaculty, updateFaculty, deleteFaculty } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { 
  FaEdit, FaTrash, FaPlus, FaUserPlus, 
  FaFileUpload, FaDownload, FaChalkboardTeacher 
} from 'react-icons/fa';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';
import Loader from '../../components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchFacultyList();
  }, []);

  const fetchFacultyList = async () => {
    try {
      const response = await getFacultyList();
      setFaculty(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch faculty list');
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.email || (!selectedFaculty && !formData.password)) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (selectedFaculty) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {})
        };
        await updateFaculty(selectedFaculty._id, updateData);
        toast.success('Faculty updated successfully');
      } else {
        const result = await addFaculty(formData);
        console.log('Faculty added:', result);
        toast.success('Faculty added successfully');
      }
      
      setShowModal(false);
      fetchFacultyList();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error processing faculty:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to process faculty');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await deleteFaculty(id);
        toast.success('Faculty deleted successfully');
        fetchFacultyList();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV content
    const csvContent = "name,email,department\nJohn Doe,john@example.com,Computer Science\n";
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_URL}/admin/faculty/import`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(
        `${response.data.count} faculty members imported successfully! Check the console for passwords.`,
        { duration: 10000 }
      );
      
      console.table(response.data.faculty.map(f => ({
        name: f.name,
        email: f.email,
        password: f.initialPassword
      })));

      fetchFacultyList();
    } catch (error) {
      toast.error('Error importing faculty members');
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Faculty Management
          </h1>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadTemplate}
              className={`flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded`}
            >
              <FaDownload className="mr-2" />
              <span className="hidden sm:inline">Download Template</span>
              <span className="sm:hidden">Template</span>
            </button>
            
            <button
              onClick={() => {
                setSelectedFaculty(null);
                setFormData({ name: '', email: '', password: '' });
                setShowModal(true);
              }}
              className={`flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white rounded`}
            >
              <FaUserPlus className="mr-2" />
              <span>Add Faculty</span>
            </button>

            <label className={`flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base ${
              darkMode 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white rounded cursor-pointer`}>
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

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader size="large" />
            <p className={`mt-4 text-base sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading faculty members...
            </p>
          </div>
        ) : faculty.length === 0 ? (
          <div className={`text-center py-12 sm:py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaChalkboardTeacher className="mx-auto text-4xl sm:text-5xl mb-4 opacity-50" />
            <p className="text-lg sm:text-xl">No faculty members found</p>
            <button
              onClick={() => {
                setSelectedFaculty(null);
                setFormData({ name: '', email: '', password: '' });
                setShowModal(true);
              }}
              className={`mt-4 flex items-center px-4 py-2 mx-auto text-sm sm:text-base ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded`}
            >
              <FaPlus className="mr-2" />
              Add Faculty
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {faculty.map((member) => (
              <div 
                key={member._id} 
                className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } rounded-lg shadow-md p-4 sm:p-6 border transition-transform hover:scale-105`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <FaChalkboardTeacher className="text-blue-500 mr-2 text-lg sm:text-xl flex-shrink-0" />
                      <h2 className={`text-lg sm:text-xl font-bold truncate ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {member.name}
                      </h2>
                    </div>
                    <p className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    } text-sm truncate`}>
                      {member.email}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedFaculty(member);
                        setFormData({
                          name: member.name,
                          email: member.email,
                          password: ''
                        });
                        setShowModal(true);
                      }}
                      className={`p-2 rounded-md ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-blue-400' 
                          : 'hover:bg-gray-100 text-blue-600'
                      }`}
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className={`p-2 rounded-md ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-red-400' 
                          : 'hover:bg-gray-100 text-red-600'
                      }`}
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className={`text-xs sm:text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <p>Department: {member.department || 'Not specified'}</p>
                  <p>Added: {new Date(member.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${
              darkMode ? 'bg-[#242b3d] border-[#2d3548]' : 'bg-white'
            } p-4 sm:p-6 rounded-lg w-full max-w-md mx-4`}>
              <h2 className={`text-lg sm:text-xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {selectedFaculty ? 'Edit Faculty' : 'Add Faculty'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {selectedFaculty ? 'New Password (optional)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-[#1a1f2c] border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    {...(!selectedFaculty && { required: true })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-md ${
                      darkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`w-full sm:w-auto px-4 py-2 rounded-md ${
                      darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {selectedFaculty ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyManagement; 