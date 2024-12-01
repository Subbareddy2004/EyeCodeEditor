import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

const FacultyForm = () => {
  const { darkMode } = useTheme();
  const [facultyData, setFacultyData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [students, setStudents] = useState([]);
  const [bulkUpload, setBulkUpload] = useState(false);
  const [file, setFile] = useState(null);

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/faculty/create', {
        ...facultyData,
        students
      });
      toast.success('Faculty created successfully');
      // Reset form
      setFacultyData({ name: '', email: '', password: '' });
      setStudents([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating faculty');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/admin/faculty/students/bulk', formData);
      toast.success('Students uploaded successfully');
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading students');
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-4">Add New Faculty</h2>
      
      <form onSubmit={handleFacultySubmit}>
        {/* Faculty Details */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Faculty Name"
            value={facultyData.name}
            onChange={(e) => setFacultyData({...facultyData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Faculty Email"
            value={facultyData.email}
            onChange={(e) => setFacultyData({...facultyData, email: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={facultyData.password}
            onChange={(e) => setFacultyData({...facultyData, password: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Student Management */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Add Students</h3>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setBulkUpload(false)}
              className={`px-4 py-2 rounded ${!bulkUpload ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Add Individual
            </button>
            <button
              type="button"
              onClick={() => setBulkUpload(true)}
              className={`px-4 py-2 rounded ${bulkUpload ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Bulk Upload
            </button>
          </div>

          {!bulkUpload ? (
            <div>
              {/* Individual student form */}
              {students.map((student, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={student.name}
                    onChange={(e) => {
                      const newStudents = [...students];
                      newStudents[index].name = e.target.value;
                      setStudents(newStudents);
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Student Email"
                    value={student.email}
                    onChange={(e) => {
                      const newStudents = [...students];
                      newStudents[index].email = e.target.value;
                      setStudents(newStudents);
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newStudents = students.filter((_, i) => i !== index);
                      setStudents(newStudents);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setStudents([...students, { name: '', email: '' }])}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Student
              </button>
            </div>
          ) : (
            <div>
              {/* Bulk upload form */}
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-4"
              />
              <button
                type="button"
                onClick={handleBulkUpload}
                className="px-4 py-2 bg-green-500 text-white rounded"
                disabled={!file}
              >
                Upload Students
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Faculty
        </button>
      </form>
    </div>
  );
};

export default FacultyForm; 