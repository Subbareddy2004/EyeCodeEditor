import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts';
import { getContests } from '../../services/contestService';
import { getSubmissionStats, getRecentSubmissions } from '../../services/submissionService';

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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Faculty Dashboard</h1>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Contests</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalContests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Contests</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeContests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Submissions</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalSubmissions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Success Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{successRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submission Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Submission Statistics</h3>
          <BarChart width={500} height={300} data={stats.submissionStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Problem Difficulty Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Problem Difficulty Distribution</h3>
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

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
          <div className="space-y-4">
            {stats.recentSubmissions.map((submission) => (
              <div key={submission._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{submission.student.name}</p>
                  <p className="text-sm text-gray-600">{submission.problem.title}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  submission.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/faculty/contests" className="block w-full p-3 text-center bg-green-500 text-white rounded-md hover:bg-green-600">
              Create New Contest
            </Link>
            <Link to="/faculty/problems/create" className="block w-full p-3 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add New Problem
            </Link>
            <Link to="/faculty/students" className="block w-full p-3 text-center bg-purple-500 text-white rounded-md hover:bg-purple-600">
              View Student Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
