import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaTrophy, FaPlay, FaCode, FaUsers } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContests: 0,
    activeContests: 0,
    totalSubmissions: 0,
    totalStudents: 0
  });
  const [submissionData, setSubmissionData] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchSubmissionStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/faculty/dashboard`,
        { headers: getAuthHeaders() }
      );
      
      setStats({
        totalContests: response.data.stats.contestCount || 0,
        activeContests: response.data.stats.activeContestCount || 0,
        totalSubmissions: response.data.stats.submissionCount || 0,
        totalStudents: response.data.stats.studentCount || 0
      });
      
      // Format submission stats for the chart
      const formattedStats = response.data.submissionStats.map(stat => ({
        name: new Date(stat.name).toLocaleDateString(),
        count: stat.count
      }));
      setSubmissionData(formattedStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/submission-stats`,
        { headers: getAuthHeaders() }
      );
      setSubmissionData(response.data);
    } catch (error) {
      console.error('Error fetching submission stats:', error);
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
          Faculty Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Contests"
                value={stats.totalContests}
                icon={<FaTrophy />}
                color="text-green-500"
              />
              <StatCard
                title="Active Contests"
                value={stats.activeContests}
                icon={<FaPlay />}
                color="text-blue-500"
              />
              <StatCard
                title="Total Submissions"
                value={stats.totalSubmissions}
                icon={<FaCode />}
                color="text-purple-500"
              />
              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                icon={<FaUsers />}
                color="text-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Submission Statistics */}
              <div className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Submission Statistics
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={submissionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link to="/faculty/contests/create" 
                    className="block w-full p-3 text-center text-white bg-green-500 rounded-lg hover:bg-green-600">
                    Create New Contest
                  </Link>
                  <Link to="/faculty/problems/create"
                    className="block w-full p-3 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Add New Problem
                  </Link>
                  <Link to="/faculty/students"
                    className="block w-full p-3 text-center text-white bg-purple-500 rounded-lg hover:bg-purple-600">
                    View Students
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
