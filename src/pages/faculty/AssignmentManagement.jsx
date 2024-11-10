import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { FaEdit, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/assignments`,
        { headers: getAuthHeaders() }
      );
      const formattedAssignments = response.data.map(assignment => ({
        id: assignment._id,
        title: assignment.title,
        dueDate: new Date(assignment.dueDate),
        status: new Date() > new Date(assignment.dueDate) ? 'Expired' : 'Active',
        problems: assignment.problems?.length || 0
      }));
      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await axios.delete(
          `${API_URL}/faculty/assignments/${id}`,
          { headers: getAuthHeaders() }
        );
        toast.success('Assignment deleted successfully');
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Assignment Management
        </h1>
        <Link
          to="/faculty/assignments/create"
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
        >
          + Create Assignment
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium">TITLE</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium">DUE DATE</th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium">STATUS</th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium">PROBLEMS</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200'}`}>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{assignment.title}</span>
                      {/* Mobile-only info */}
                      <div className="sm:hidden space-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <div>{assignment.dueDate.toLocaleDateString()}</div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            assignment.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        <div>{assignment.problems} problems</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                    {assignment.dueDate.toLocaleDateString()}
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      assignment.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                    {assignment.problems}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex space-x-3">
                      <Link 
                        to={`/faculty/assignments/${assignment.id}/submissions`}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View Submissions"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/faculty/assignments/${assignment.id}/edit`}
                        className="text-yellow-500 hover:text-yellow-700 p-1"
                        title="Edit Assignment"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Assignment"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-8">
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No assignments found. Create your first assignment to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;