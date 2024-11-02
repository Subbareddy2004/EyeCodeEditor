import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Assignment Management
        </h1>
        <Link
          to="/faculty/assignments/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create Assignment
        </Link>
      </div>

      <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">TITLE</th>
              <th className="px-6 py-3 text-left">DUE DATE</th>
              <th className="px-6 py-3 text-left">STATUS</th>
              <th className="px-6 py-3 text-left">PROBLEMS</th>
              <th className="px-6 py-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200'}`}>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4">{assignment.title}</td>
                <td className="px-6 py-4">
                  {assignment.dueDate.toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    assignment.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4">{assignment.problems}</td>
                <td className="px-6 py-4 space-x-3">
                  <Link 
                    to={`/faculty/assignments/${assignment.id}/submissions`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye className="inline" />
                  </Link>
                  <Link 
                    to={`/faculty/assignments/${assignment.id}/edit`}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FaEdit className="inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentManagement;