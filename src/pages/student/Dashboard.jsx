import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTrophy, FaChartLine, FaClipboardList } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="container mx-auto p-6">
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">
        Welcome back, {user?.name || 'Student'}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-indigo-600 mb-2">
            <FaCode className="text-2xl" />
          </div>
          <div className="text-4xl font-bold mb-2">{stats.problemsSolved}</div>
          <div className="text-gray-600">Problems Solved</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-purple-600 mb-2">
            <FaChartLine className="text-2xl" />
          </div>
          <div className="text-4xl font-bold mb-2">#{stats.collegeRank}</div>
          <div className="text-gray-600">College Ranking</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-green-600 mb-2">
            <FaClipboardList className="text-2xl" />
          </div>
          <div className="text-4xl font-bold mb-2">{stats.completedAssignments}</div>
          <div className="text-gray-600">Completed Assignments</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link to="/student/problems" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Practice</h2>
          <p className="text-gray-600 mb-2">Solve coding problems</p>
          <div className="text-indigo-600">Start practicing →</div>
        </Link>

        <Link to="/student/assignments" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Assignments</h2>
          <p className="text-gray-600 mb-2">Complete your tasks</p>
          <div className="text-indigo-600">View assignments →</div>
        </Link>

        <Link to="/student/contests" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Contests</h2>
          <p className="text-gray-600 mb-2">Participate in competitions</p>
          <div className="text-indigo-600">View contests →</div>
        </Link>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Problems */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Problems</h2>
          {recentProblems.length > 0 ? (
            <ul className="space-y-3">
              {recentProblems.map(problem => (
                <li key={problem._id} className="flex justify-between items-center">
                  <Link to={`/student/problems/${problem._id}`} className="text-indigo-600 hover:text-indigo-800">
                    {problem.title}
                  </Link>
                  <span className={`px-2 py-1 rounded text-xs ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {problem.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent problems</p>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
          {upcomingAssignments.length > 0 ? (
            <ul className="space-y-3">
              {upcomingAssignments.map(assignment => (
                <li key={assignment._id} className="flex justify-between items-center">
                  <Link to={`/student/assignments/${assignment._id}`} className="text-indigo-600 hover:text-indigo-800">
                    {assignment.title}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming assignments</p>
          )}
        </div>

        {/* Upcoming Contests */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upcoming Contests</h2>
          {upcomingContests.length > 0 ? (
            <ul className="space-y-3">
              {upcomingContests.map(contest => (
                <li key={contest._id} className="flex justify-between items-center">
                  <Link to={`/student/contests/${contest._id}`} className="text-indigo-600 hover:text-indigo-800">
                    {contest.title}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(contest.startTime).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming contests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;