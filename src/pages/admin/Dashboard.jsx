import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FaGraduationCap, FaChalkboardTeacher, FaCode, FaTrophy, FaClipboardList } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const timeRangeOptions = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last Week', value: '1w' },
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
  { label: 'All Time', value: 'all' }
];

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState('1w');
  const [submissionStats, setSubmissionStats] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalProblems: 0,
    totalContests: 0,
    totalAssignments: 0,
    totalSubmissions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/dashboard?timeRange=${selectedTimeRange}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data) {
        setSubmissionStats(response.data.submissionStats || []);
        setStats(response.data.stats || {
          totalStudents: 0,
          totalFaculty: 0,
          totalProblems: 0,
          totalContests: 0,
          totalAssignments: 0,
          totalSubmissions: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = async (e) => {
    const newTimeRange = e.target.value;
    setSelectedTimeRange(newTimeRange);
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

      {/* Submissions Graph */}
      <div className={`p-6 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Submission Statistics
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={selectedTimeRange}
              onChange={handleTimeRangeChange}
              className={`p-2 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={submissionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="submissions" 
                name="Submissions" 
                fill="#4F46E5"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
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