import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTrophy, FaChartLine, FaClipboardList } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    problemsSolved: 0,
    collegeRank: 'N/A',
    completedAssignments: 0
  });
  const [recentProblems, setRecentProblems] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, problemsRes, assignmentsRes, contestsRes] = await Promise.all([
          api.get(`/students/stats/${user._id}`),
          api.get('/problems/recent'),
          api.get('/assignments/upcoming'),
          api.get('/contests/upcoming')
        ]);

        setStats(statsRes.data);
        setRecentProblems(problemsRes.data || []);
        setUpcomingAssignments(assignmentsRes.data || []);
        setUpcomingContests(contestsRes.data || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-[#1a1f2c]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
    }`}>
      <div className="container mx-auto p-6">
        {/* Welcome Message */}
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
          Welcome back, {user?.name || 'Student'}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="text-blue-400 mb-2">
              <FaCode className="text-2xl" />
            </div>
            <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.problemsSolved}
            </div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Problems Solved</div>
          </div>

          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="text-purple-400 mb-2">
              <FaChartLine className="text-2xl" />
            </div>
            <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              #{stats.collegeRank}
            </div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>College Ranking</div>
          </div>

          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="text-green-400 mb-2">
              <FaClipboardList className="text-2xl" />
            </div>
            <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.completedAssignments}
            </div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Completed Assignments</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Practice</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Solve coding problems</p>
            <div className="text-blue-400 hover:text-blue-300">Start practicing →</div>
          </div>

          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Assignments</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your tasks</p>
            <div className="text-blue-400 hover:text-blue-300">View assignments →</div>
          </div>

          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Contests</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Participate in competitions</p>
            <div className="text-blue-400 hover:text-blue-300">View contests →</div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Problems */}
          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Problems</h2>
            <ul className="space-y-3">
              {recentProblems.map(problem => (
                <li key={problem._id} className="flex justify-between items-center">
                  <Link 
                    to={`/student/problems/${problem._id}`} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {problem.title}
                  </Link>
                  <span className={`px-2 py-1 rounded text-xs ${
                    darkMode ? (
                      problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800' :
                      'bg-red-900/50 text-red-300 border border-red-800'
                    ) : (
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    )
                  }`}>
                    {problem.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Assignments */}
          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upcoming Assignments</h2>
            <ul className="space-y-3">
              {upcomingAssignments.map(assignment => (
                <li key={assignment._id} className="flex justify-between items-center">
                  <Link 
                    to={`/student/assignments/${assignment._id}`} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {assignment.title}
                  </Link>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Contests */}
          <div className={`${darkMode ? 'bg-[#242b3d] border border-[#2d3548]' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upcoming Contests</h2>
            <ul className="space-y-3">
              {upcomingContests.map(contest => (
                <li key={contest._id} className="flex justify-between items-center">
                  <Link 
                    to={`/student/contests/${contest._id}`} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {contest.title}
                  </Link>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                    {new Date(contest.startTime).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;