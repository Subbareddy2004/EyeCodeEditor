import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/authUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode, FaTrophy, FaClipboardList } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      problemsSolved: 0,
      leaderboardRank: 'N/A',
      completedAssignments: 0
    },
    recentProblems: [],
    upcomingAssignments: [],
    upcomingContests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/student/dashboard`,
          { headers: getAuthHeaders() }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
        Welcome back, {user?.name}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={<FaCode />}
          value={dashboardData.stats.problemsSolved}
          label="Problems Solved"
          darkMode={darkMode}
        />
        <StatsCard
          icon={<FaTrophy />}
          value={`#${dashboardData.stats.leaderboardRank}`}
          label="Leaderboard Rank"
          darkMode={darkMode}
        />
        <StatsCard
          icon={<FaClipboardList />}
          value={dashboardData.stats.completedAssignments}
          label="Completed Assignments"
          darkMode={darkMode}
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActionCard
          title="Practice"
          description="Solve coding problems"
          link="/student/practice"
          linkText="Start practicing →"
          darkMode={darkMode}
        />
        <ActionCard
          title="Assignments"
          description="Complete your tasks"
          link="/student/assignments"
          linkText="View assignments →"
          darkMode={darkMode}
        />
        <ActionCard
          title="Contests"
          description="Participate in competitions"
          link="/student/contests"
          linkText="View contests →"
          darkMode={darkMode}
        />
      </div>

      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentList
          title="Recent Problems"
          items={dashboardData.recentProblems}
          type="problems"
          darkMode={darkMode}
        />
        <RecentList
          title="Upcoming Assignments"
          items={dashboardData.upcomingAssignments}
          type="assignments"
          darkMode={darkMode}
        />
        <RecentList
          title="Upcoming Contests"
          items={dashboardData.upcomingContests}
          type="contests"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

const StatsCard = ({ icon, value, label, darkMode }) => (
  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
    <div className={`text-3xl mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>{icon}</div>
    <div className={`text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
    <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{label}</div>
  </div>
);

const ActionCard = ({ title, description, link, linkText, darkMode }) => (
  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>{title}</h3>
    <p className={darkMode ? 'text-gray-300 mb-4' : 'text-gray-600 mb-4'}>{description}</p>
    <Link to={link} className="text-blue-500 hover:text-blue-600">
      {linkText}
    </Link>
  </div>
);

const RecentList = ({ title, items, type, darkMode }) => (
  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
    <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link 
              to={`/student/${type}/${item.id}`} 
              className={`hover:text-blue-500 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              {item.name}
            </Link>
            {item.difficulty && (
              <span className={`text-xs px-2 py-1 rounded ${
                item.difficulty === 'Hard' 
                  ? 'bg-red-100 text-red-800' 
                  : item.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.difficulty}
              </span>
            )}
          </div>
          {item.date && (
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.date}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;