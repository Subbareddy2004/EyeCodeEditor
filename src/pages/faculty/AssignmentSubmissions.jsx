import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { FaArrowLeft, FaCode } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

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

  const formatProgress = (completed, total) => {
    return `${completed} / ${total}`;
  };

  const formatScore = (score) => {
    return score ? `${score}%` : 'N/A';
  };

  // Add a function to sort submissions
  const getSortedSubmissions = () => {
    return [...submissions].sort((a, b) => {
      // Sort by score (high to low)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by problems completed
      if (b.problemsCompleted !== a.problemsCompleted) {
        return b.problemsCompleted - a.problemsCompleted;
      }
      // If problems completed are equal, sort by last submission date
      if (b.lastSubmission && a.lastSubmission) {
        return new Date(b.lastSubmission) - new Date(a.lastSubmission);
      }
      // Put submissions before non-submissions
      if (b.lastSubmission && !a.lastSubmission) return 1;
      if (!b.lastSubmission && a.lastSubmission) return -1;
      // If all else is equal, sort by name
      return a.student.name.localeCompare(b.student.name);
    });
  };

  // Add this function to get the latest submission for a problem
  const getLatestSubmission = (studentId, problemId) => {
    const studentSubmissions = assignment?.submissions?.filter(
      sub => sub.student === studentId && sub.problemId === problemId
    ) || [];
    
    return studentSubmissions.sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    )[0];
  };

  // Add this function to handle viewing code
  const handleViewCode = async (studentId) => {
    try {
      // Get all submissions for this student
      const studentSubmissions = assignment?.submissions?.filter(
        sub => sub.student === studentId
      ) || [];

      // Group submissions by problem and get the latest for each
      const latestSubmissions = assignment?.problems?.map(problemId => {
        const problemSubmissions = studentSubmissions.filter(
          sub => sub.problemId === problemId
        );
        return problemSubmissions.sort((a, b) => 
          new Date(b.submittedAt) - new Date(a.submittedAt)
        )[0];
      }).filter(Boolean);

      setSelectedSubmission(latestSubmissions);
      setShowCodeModal(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
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
              <th className="px-6 py-3 text-left">RANK</th>
              <th className="px-6 py-3 text-left">STUDENT</th>
              <th className="px-6 py-3 text-left">STATUS</th>
              <th className="px-6 py-3 text-left">PROBLEMS COMPLETED</th>
              <th className="px-6 py-3 text-left">LAST SUBMISSION</th>
              <th className="px-6 py-3 text-left">SCORE</th>
              <th className="px-6 py-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200'}`}>
            {getSortedSubmissions().map((submission, index) => (
              <tr key={submission.student.email}>
                <td className="px-6 py-4">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{submission.student.name}</div>
                  <div className="text-sm text-gray-500">{submission.student.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    submission.status === 'PASSED'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {submission.problemsCompleted}
                </td>
                <td className="px-6 py-4">
                  {submission.lastSubmission 
                    ? new Date(submission.lastSubmission).toLocaleString()
                    : 'Not submitted'}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    submission.score > 0 
                      ? 'text-green-500' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {submission.score > 0 ? `${submission.score}%` : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewCode(submission.student._id)}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <FaCode className="mr-2" />
                    View Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Code Modal */}
      {showCodeModal && selectedSubmission && (
        <Modal
          isOpen={showCodeModal}
          onClose={() => setShowCodeModal(false)}
          title="Student Submissions"
        >
          <div className="space-y-6">
            {selectedSubmission.map((sub, index) => (
              <div key={index} className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Problem {index + 1}
                  </h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    sub.status === 'PASSED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <div className="mb-2">
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Language: {sub.language}
                  </span>
                </div>
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                }`}>
                  <code>{sub.code}</code>
                </pre>
                <div className="mt-2 text-sm text-gray-500">
                  Submitted: {new Date(sub.submittedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssignmentSubmissions;