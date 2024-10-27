import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems, getLeaderboard, getUpcomingContests } from '../../services/problems';

const FacultyDashboard = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsData, leaderboardData, contestsData] = await Promise.all([
          getProblems(),
          getLeaderboard(),
          getUpcomingContests()
        ]);
        setProblems(problemsData);
        setLeaderboard(leaderboardData);
        setUpcomingContests(contestsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Faculty Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Contest Management</h2>
          <Link to="/faculty/contest-management" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Manage Contests</Link>
          <ul className="mt-4 space-y-2">
            {upcomingContests.map((contest, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{contest.name}</span>
                <span className="text-gray-500">{contest.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Problem Creation</h2>
          <Link to="/faculty/problem-creation" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Create New Problem</Link>
          <ul className="mt-4 space-y-2">
            {problems.slice(0, 5).map((problem) => (
              <li key={problem._id}>{problem.title}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Student Progress</h2>
          <ul className="space-y-2">
            {leaderboard.slice(0, 5).map((student, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{student.name}</span>
                <span>{student.score} points</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
          <ul className="space-y-2">
            <li>John Doe - Two Sum (Accepted)</li>
            <li>Jane Smith - Reverse Linked List (Wrong Answer)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
