import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignmentAndSubmissions();
  }, [id]);

  const fetchAssignmentAndSubmissions = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        axios.get(`${API_URL}/faculty/assignments/${id}`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/faculty/assignments/${id}/submissions`, { headers: getAuthHeaders() })
      ]);
      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
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
      <div className="flex items-center mb-8">
        <Link to="/faculty/assignments" className="text-blue-500 hover:text-blue-600 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {assignment?.title}
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Due: {new Date(assignment?.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">STUDENT</th>
              <th className="px-6 py-3 text-left">STATUS</th>
              <th className="px-6 py-3 text-left">PROBLEMS COMPLETED</th>
              <th className="px-6 py-3 text-left">LAST SUBMISSION</th>
              <th className="px-6 py-3 text-left">SCORE</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200'}`}>
            {submissions.map((submission) => (
              <tr key={submission.student._id}>
                <td className="px-6 py-4">
                  <div className="font-medium">{submission.student.name}</div>
                  <div className="text-sm text-gray-500">{submission.student.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    submission.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {submission.completedProblems || 0} / {assignment?.problems?.length || 0}
                </td>
                <td className="px-6 py-4">
                  {submission.submittedAt 
                    ? new Date(submission.submittedAt).toLocaleString()
                    : 'Not submitted'}
                </td>
                <td className="px-6 py-4">
                  {submission.score !== null ? `${submission.score}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;