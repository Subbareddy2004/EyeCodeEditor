import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCheck, FaUser, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const IssueManagement = () => {
  const { darkMode } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/admin/reports');
      setReports(response.data);
    } catch (error) {
      toast.error('Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, status) => {
    try {
      await axios.patch(`/admin/reports/${reportId}`, { status });
      toast.success('Status updated successfully');
      fetchReports();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Student Issues
      </h2>
      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report._id}
            className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationCircle className={getPriorityColor(report.priority)} />
                  <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {report.subject}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-gray-400" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {report.student?.name || 'Unknown Student'}
                    </span>
                  </div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {report.student?.email}
                  </span>
                </div>

                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className={`flex items-center gap-1 text-sm ${getPriorityColor(report.priority)}`}>
                    Priority: {report.priority}
                  </span>
                  <span className={`flex items-center gap-1 text-sm ${getStatusColor(report.status)}`}>
                    <FaClock className="text-gray-400" />
                    Status: {report.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    Reported: {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                {report.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus(report._id, 'resolved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FaCheck />
                    Mark Resolved
                  </button>
                )}
                {report.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(report._id, 'in-progress')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Progress
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No issues reported yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueManagement; 