import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaTrophy, FaCode, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeContests: 0,
    participatedContests: 0,
    completedAssignments: 0
  });
  const [submissionData, setSubmissionData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/student/dashboard`,
        { headers: getAuthHeaders() }
      );
      
      setStats({
        activeContests: response.data.stats.activeContests || 0,
        participatedContests: response.data.stats.participatedContests || 0,
        completedAssignments: response.data.stats.completedAssignments || 0
      });

      setPerformanceData(response.data.performanceStats || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold ${color}`}>
            {value}
          </p>
        </div>
        <div className={`text-3xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gradient-to-br from-indigo-100 to-blue-200'}`}>
      <div className="container mx-auto p-6">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Student Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Active Contests"
                value={stats.activeContests}
                icon={<FaTrophy />}
                color="text-green-500"
              />
              <StatCard
                title="Participated Contests"
                value={stats.participatedContests}
                icon={<FaCode />}
                color="text-blue-500"
              />
              <StatCard
                title="Completed Assignments"
                value={stats.completedAssignments}
                icon={<FaCheckCircle />}
                color="text-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Statistics */}
              <div className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Assignment Progress
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#4F46E5" name="Total Assignments" />
                      <Bar dataKey="completed" fill="#22C55E" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Add completion percentage */}
                {performanceData.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Completion Rate: 
                      <span className="font-bold ml-2">
                        {Math.round((performanceData[0].completed / performanceData[0].total) * 100 || 0)}%
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link to="/student/contests"
                    className="block w-full p-3 text-center text-white bg-green-500 rounded-lg hover:bg-green-600">
                    View Active Contests
                  </Link>
                  <Link to="/student/problems"
                    className="block w-full p-3 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Practice Problems
                  </Link>
                  <Link to="/student/assignments"
                    className="block w-full p-3 text-center text-white bg-purple-500 rounded-lg hover:bg-purple-600">
                    View My Assignments
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;