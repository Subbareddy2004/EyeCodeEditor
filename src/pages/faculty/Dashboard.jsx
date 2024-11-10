import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/StatCard';
import { FaBook, FaUsers, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAssignments: 0,
      totalStudents: 0,
      totalContests: 0
    },
    assignmentStats: []
  });
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/faculty/dashboard`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data) {
        setDashboardData(response.data);
        if (response.data.assignmentStats?.length > 0) {
          setSelectedAssignment(response.data.assignmentStats[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!dashboardData.assignmentStats?.length) return [];

    if (selectedAssignment === 'all') {
      return dashboardData.assignmentStats.map(stat => ({
        name: stat.title,
        completed: stat.completedStudents,
        total: stat.totalStudents
      }));
    }

    const selectedStat = dashboardData.assignmentStats.find(
      stat => stat._id === selectedAssignment
    );

    return selectedStat ? [{
      name: selectedStat.title,
      completed: selectedStat.completedStudents,
      total: selectedStat.totalStudents
    }] : [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Faculty Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <StatCard
          title="Total Assignments"
          value={dashboardData.stats.totalAssignments}
          icon={<FaBook />}
          color="text-blue-500"
        />
        <StatCard
          title="Total Students"
          value={dashboardData.stats.totalStudents}
          icon={<FaUsers />}
          color="text-green-500"
        />
        <StatCard
          title="Total Contests"
          value={dashboardData.stats.totalContests}
          icon={<FaTrophy />}
          color="text-yellow-500"
        />
      </div>

      {/* Chart and Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Assignment Progress Chart - Decreased Height */}
        <div className={`lg:col-span-2 p-4 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Assignment Progress
            </h2>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className={`w-full sm:w-auto p-2 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              <option value="all">All Assignments</option>
              {dashboardData.assignmentStats?.map(stat => (
                <option key={stat._id} value={stat._id}>
                  {stat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Decreased chart height */}
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" name="Started Students" fill="#22C55E" />
                <Bar dataKey="total" name="Total Students" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-4 rounded-lg shadow-md ${
          darkMode ? 'bg-[#242b3d] border border-gray-700' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link 
              to="/faculty/assignments/create"
              className="block w-full p-3 text-center text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Create New Assignment
            </Link>
            <Link 
              to="/faculty/problems/create"
              className="block w-full p-3 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add New Problem
            </Link>
            <Link 
              to="/faculty/students"
              className="block w-full p-3 text-center text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
            >
              View Students
            </Link>
            <Link 
              to="/faculty/assignments"
              className="block w-full p-3 text-center text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Manage Assignments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;