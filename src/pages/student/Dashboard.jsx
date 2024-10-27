import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTrophy, FaChartLine, FaClipboardList, FaRocket, FaCalendarAlt } from 'react-icons/fa';

const Dashboard = ({ user }) => {
  const [recentProblems, setRecentProblems] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [userStats, setUserStats] = useState({ solved: 0, ranking: 0, completedAssignments: 0 });

  useEffect(() => {
    // Simulating API calls with dummy data
    setRecentProblems([
      { id: '1', title: 'Two Sum', difficulty: 'Easy' },
      { id: '2', title: 'Reverse Linked List', difficulty: 'Medium' },
      { id: '3', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard' },
    ]);

    setUpcomingAssignments([
      { id: '1', title: 'Array Manipulation', dueDate: '2023-05-18T23:59:59Z' },
      { id: '2', title: 'Dynamic Programming Basics', dueDate: '2023-05-22T23:59:59Z' },
    ]);

    setUpcomingContests([
      { id: '1', name: 'Weekly Challenge #1', startTime: '2023-05-15T10:00:00Z' },
      { id: '2', name: 'Monthly Coding Marathon', startTime: '2023-05-20T09:00:00Z' },
    ]);

    setUserStats({ solved: 42, ranking: 1337, completedAssignments: 15 });
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900 text-center">Welcome back, {user.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Problems Solved" value={userStats.solved} icon={<FaCode />} color="indigo" />
          <StatCard title="College Ranking" value={`#${userStats.ranking}`} icon={<FaChartLine />} color="purple" />
          <StatCard title="Completed Assignments" value={userStats.completedAssignments} icon={<FaClipboardList />} color="blue" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Practice" description="Solve coding problems" icon={<FaCode />} linkTo="/student/problems" color="indigo" />
          <DashboardCard title="Assignments" description="Complete your tasks" icon={<FaClipboardList />} linkTo="/student/assignments" color="purple" />
          <DashboardCard title="Contests" description="Participate in competitions" icon={<FaTrophy />} linkTo="/student/contests" color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentProblems problems={recentProblems} />
          <UpcomingAssignments assignments={upcomingAssignments} />
          <UpcomingContests contests={upcomingContests} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 border-b-4 border-${color}-500 hover:shadow-lg transition-shadow duration-300`}>
    <div className={`text-${color}-500 text-4xl mb-4`}>{icon}</div>
    <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
    <div className="text-sm text-gray-600">{title}</div>
  </div>
);

const DashboardCard = ({ title, description, icon, linkTo, color }) => (
  <Link to={linkTo} className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-${color}-500`}>
    <div className={`text-${color}-500 text-3xl mb-4`}>{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Link>
);

const RecentProblems = ({ problems }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-indigo-900">Recent Problems</h2>
    <ul className="space-y-3">
      {problems.map((problem) => (
        <li key={problem.id} className="flex justify-between items-center">
          <Link to={`/student/problems/${problem.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
            {problem.title}
          </Link>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold
            ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}`}>
            {problem.difficulty}
          </span>
        </li>
      ))}
    </ul>
    <Link to="/student/problems" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold">
      View all problems <FaRocket className="inline ml-1" />
    </Link>
  </div>
);

const UpcomingAssignments = ({ assignments }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-purple-800">Upcoming Assignments</h2>
    <ul className="space-y-3">
      {assignments.map((assignment) => (
        <li key={assignment.id} className="flex justify-between items-center">
          <Link to={`/student/assignments/${assignment.id}`} className="text-purple-600 hover:text-purple-800 font-medium">
            {assignment.title}
          </Link>
          <span className="text-sm text-gray-600 flex items-center bg-purple-100 px-2 py-1 rounded-full">
            <FaCalendarAlt className="mr-1 text-purple-500" />
            {new Date(assignment.dueDate).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
    <Link to="/student/assignments" className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-semibold">
      View all assignments <FaRocket className="inline ml-1" />
    </Link>
  </div>
);

const UpcomingContests = ({ contests }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Upcoming Contests</h2>
    <ul className="space-y-3">
      {contests.map((contest) => (
        <li key={contest.id} className="flex justify-between items-center">
          <Link to={`/student/contests/${contest.id}`} className="text-yellow-600 hover:text-yellow-800 font-medium">
            {contest.name}
          </Link>
          <span className="text-sm text-gray-600 flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <FaCalendarAlt className="mr-1 text-yellow-500" />
            {new Date(contest.startTime).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
    <Link to="/student/contests" className="mt-4 inline-block text-yellow-600 hover:text-yellow-800 font-semibold">
      View all contests <FaRocket className="inline ml-1" />
    </Link>
  </div>
);

export default Dashboard;
