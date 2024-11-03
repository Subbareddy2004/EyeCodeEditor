import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaCode, FaTrophy, FaClipboardList } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    problemsSolved: 0,
    leaderboardRank: 0,
    completedAssignments: 0,
    upcomingAssignments: [],
    recentProblems: [],
    upcomingContests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leaderboardRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/assignments/leaderboard`, {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axios.get(`${API_URL}/student/dashboard`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);

        // Find user's rank from leaderboard
        const userRank = leaderboardRes.data.find(
          entry => entry.student._id === user.id
        )?.rank || 0;

        // Update stats with all the data
        setStats({
          problemsSolved: statsRes.data.problemsSolved || 0,
          leaderboardRank: userRank,
          completedAssignments: statsRes.data.completedAssignments || 0,
          upcomingAssignments: statsRes.data.upcomingAssignments || [],
          recentProblems: statsRes.data.recentProblems || [],
          upcomingContests: statsRes.data.upcomingContests || []
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token, user.id]);

  const StatCard = ({ icon: Icon, value, label, className = '', iconColor }) => (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'} ${className}`}>
      <div className="flex items-center mb-2">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="text-3xl text-white" />
        </div>
      </div>
      <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {value}
      </div>
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Welcome back, {user.name}!
        </h1>

        {/* Stats Grid with Enhanced Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FaCode}
            value={stats.problemsSolved}
            label="Problems Solved"
            iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FaTrophy}
            value={`#${stats.leaderboardRank}`}
            label="Leaderboard Rank"
            iconColor="bg-gradient-to-r from-yellow-500 to-amber-500"
          />
          <StatCard
            icon={FaClipboardList}
            value={stats.completedAssignments}
            label="Completed Assignments"
            iconColor="bg-gradient-to-r from-green-500 to-emerald-500"
          />
        </div>

        {/* Quick Links with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickLinkCard
            title="Practice"
            description="Solve coding problems"
            link="/student/problems"
            linkText="Start practicing →"
            icon={FaCode}
            iconColor="text-blue-500"
          />
          <QuickLinkCard
            title="Assignments"
            description="Complete your tasks"
            link="/student/assignments"
            linkText="View assignments →"
            icon={FaClipboardList}
            iconColor="text-green-500"
          />
          <QuickLinkCard
            title="Contests"
            description="Participate in competitions"
            link="/student/contests"
            linkText="View contests →"
            icon={FaTrophy}
            iconColor="text-yellow-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivitySection
            title="Recent Problems"
            items={stats.recentProblems}
            type="problems"
          />
          <ActivitySection
            title="Upcoming Assignments"
            items={stats.upcomingAssignments}
            type="assignments"
          />
          <ActivitySection
            title="Upcoming Contests"
            items={stats.upcomingContests}
            type="contests"
          />
        </div>
      </div>
    </div>
  );
};

const QuickLinkCard = ({ title, description, link, linkText, icon: Icon, iconColor }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'} transition-transform duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center mb-3">
        <Icon className={`text-2xl ${iconColor} mr-2`} />
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h3>
      </div>
      <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
      <Link
        to={link}
        className={`inline-flex items-center text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200`}
      >
        {linkText}
      </Link>
    </div>
  );
};

const ActivitySection = ({ title, items, type }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
      <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={item._id || index}
              className={`flex justify-between items-center ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <span>{item.title}</span>
              {item.dueDate && (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(item.dueDate).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No {type} available
        </p>
      )}
    </div>
  );
};

export default Dashboard;