import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/StatCard';
import { FaBook, FaUsers, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { toast } from 'react-hot-toast';

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
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Faculty Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Assignment Progress Chart */}
      <div className={`p-6 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Assignment Progress
          </h2>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className={`p-2 rounded ${
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

        <div className="h-64">
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
    </div>
  );
};

export default Dashboard;