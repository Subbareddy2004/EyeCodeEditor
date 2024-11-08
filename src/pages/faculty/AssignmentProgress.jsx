import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssignmentProgress = () => {
  const { assignmentId } = useParams();
  const { darkMode } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProgress();
  }, [assignmentId]);

  const loadProgress = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        axios.get(
          `${API_URL}/faculty/assignments/${assignmentId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        ),
        axios.get(
          `${API_URL}/faculty/assignments/${assignmentId}/submissions`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
      ]);

      setAssignment({
        ...assignmentRes.data,
        studentSubmissions: submissionsRes.data
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load submission data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {assignment?.title} - Student Submissions
        </h1>

        <div className={`overflow-x-auto rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  STUDENT
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  STATUS
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  PROBLEMS COMPLETED
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  LAST SUBMISSION
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  SCORE
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {assignment?.studentSubmissions?.map((submission, index) => (
                <tr key={submission.student.email} className={darkMode ? 'bg-[#242b3d]' : 'bg-white'}>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {submission.student.name}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {submission.student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${submission.status === 'PASSED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {`${submission.problemsCompleted} / ${submission.totalProblems}`}
                  </td>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {submission.lastSubmission 
                      ? new Date(submission.lastSubmission).toLocaleString()
                      : 'No submission yet'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    submission.score >= 70 
                      ? 'text-green-500' 
                      : darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {`${submission.score}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentProgress; 