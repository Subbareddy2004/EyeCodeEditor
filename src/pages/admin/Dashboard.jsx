import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FaGraduationCap, FaChalkboardTeacher, FaCode, FaTrophy, FaClipboardList } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalProblems: 0,
    totalContests: 0,
    totalSubmissions: 0,
    totalAssignments: 0
  });
  const [usageStats, setUsageStats] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/admin/dashboard`,
        { headers: getAuthHeaders() }
      );
      
      setStats({
        totalStudents: response.data.stats.totalStudents || 0,
        totalFaculty: response.data.stats.totalFaculty || 0,
        totalProblems: response.data.stats.totalProblems || 0,
        totalContests: response.data.stats.totalContests || 0,
        totalSubmissions: response.data.stats.totalSubmissions || 0,
        totalAssignments: response.data.stats.totalAssignments || 0
      });
      
      // Format dates for the chart
      const formattedStats = response.data.usageStats.map(stat => ({
        ...stat,
        name: new Date(stat.name).toLocaleDateString()
      }));
      setUsageStats(formattedStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} 
        flex flex-col items-center justify-center`}>
        <Loader size="large" />
        <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FaGraduationCap />}
          title="Total Students"
          value={stats.totalStudents}
          color="blue"
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaChalkboardTeacher />}
          title="Total Faculty"
          value={stats.totalFaculty}
          color="green"
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaCode />}
          title="Total Problems"
          value={stats.totalProblems}
          color="purple"
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaTrophy />}
          title="Total Contests"
          value={stats.totalContests}
          color="yellow"
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaClipboardList />}
          title="Total Assignments"
          value={stats.totalAssignments}
          color="red"
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaCode />}
          title="Total Submissions"
          value={stats.totalSubmissions}
          color="indigo"
          darkMode={darkMode}
        />
      </div>

      {/* Usage Statistics Chart */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Platform Usage Statistics
        </h2>
        <div className="overflow-x-auto">
          {usageStats.length > 0 ? (
            <BarChart 
              width={800} 
              height={400} 
              data={usageStats}
              className={darkMode ? 'text-white' : ''}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={darkMode ? '#9CA3AF' : '#4B5563'}
              />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : 'white',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  color: darkMode ? 'white' : 'black'
                }}
              />
              <Legend />
              <Bar dataKey="totalSubmissions" fill="#8884d8" name="Submissions" />
              <Bar dataKey="avgExecutionTime" fill="#82ca9d" name="Avg. Execution Time (ms)" />
            </BarChart>
          ) : (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No usage statistics available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, darkMode }) => (
  <div className={`${
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
  } rounded-lg shadow-md p-6 border-l-4 border-${color}-500 transition-transform hover:scale-105`}>
    <div className="flex items-center">
      <div className={`text-${color}-500 text-3xl mr-4`}>{icon}</div>
      <div>
        <h3 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
          {title}
        </h3>
        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;