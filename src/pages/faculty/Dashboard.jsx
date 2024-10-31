import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts';
import { getContests } from '../../services/contestService';
import { getSubmissionStats, getRecentSubmissions } from '../../services/submissionService';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    totalContests: 0,
    activeContests: 0,
    totalSubmissions: 0,
    successfulSubmissions: 0,
    submissionStats: [],
    problemDifficultyStats: [],
    recentSubmissions: []
  });

  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch contests
        const contests = await getContests();
        const now = new Date();
        const activeContests = contests.filter(contest => {
          const startTime = new Date(contest.startTime);
          const endTime = new Date(startTime.getTime() + contest.duration * 60000);
          return startTime <= now && endTime >= now;
        });

        // Fetch submission stats
        const submissionStatsData = await getSubmissionStats();
        const recentSubmissionsData = await getRecentSubmissions();

        // Calculate success rate
        const successfulSubmissions = submissionStatsData.find(stat => stat.status === 'Accepted')?.count || 0;
        const totalSubmissions = submissionStatsData.reduce((acc, stat) => acc + stat.count, 0);

        setStats({
          totalContests: contests.length,
          activeContests: activeContests.length,
          totalSubmissions,
          successfulSubmissions,
          submissionStats: submissionStatsData,
          problemDifficultyStats: [
            { difficulty: 'Easy', count: contests.filter(c => c.difficulty === 'Easy').length },
            { difficulty: 'Medium', count: contests.filter(c => c.difficulty === 'Medium').length },
            { difficulty: 'Hard', count: contests.filter(c => c.difficulty === 'Hard').length }
          ],
          recentSubmissions: recentSubmissionsData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate success rate percentage
  const successRate = stats.totalSubmissions > 0 
    ? ((stats.successfulSubmissions / stats.totalSubmissions) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className={`min-h-screen p-6 ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <h1 className={`text-3xl font-bold mb-6 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Faculty Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Total Contests
          </h3>
          <p className="text-3xl font-bold text-green-500">{stats.totalContests}</p>
        </div>
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Active Contests
          </h3>
          <p className="text-3xl font-bold text-blue-500">{stats.activeContests}</p>
        </div>
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Total Submissions
          </h3>
          <p className="text-3xl font-bold text-purple-500">{stats.totalSubmissions}</p>
        </div>
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Success Rate
          </h3>
          <p className="text-3xl font-bold text-orange-500">{successRate}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Submission Statistics
          </h3>
          <BarChart width={500} height={300} data={stats.submissionStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
        
        <div className={`${
          darkMode 
            ? 'bg-[#242b3d] border border-[#2d3548]' 
            : 'bg-white/80 backdrop-blur-sm'
        } p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Problem Difficulty Distribution
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.problemDifficultyStats}
              dataKey="count"
              nameKey="difficulty"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.problemDifficultyStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${
        darkMode 
          ? 'bg-[#242b3d] border border-[#2d3548]' 
          : 'bg-white/80 backdrop-blur-sm'
      } p-6 rounded-lg shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/faculty/contests" className="block p-3 text-center bg-green-500 text-white rounded-md hover:bg-green-600">
            Create New Contest
          </Link>
          <Link to="/faculty/problems/create" className="block p-3 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add New Problem
          </Link>
          <Link to="/faculty/students" className="block p-3 text-center bg-purple-500 text-white rounded-md hover:bg-purple-600">
            View Student Progress
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
