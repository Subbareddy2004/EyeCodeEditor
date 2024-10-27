import React, { useState, useEffect } from 'react';
import { FaMedal, FaSearch } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating API call
    setLeaderboard([
      { rank: 1, name: 'John Doe', score: 1500 },
      { rank: 2, name: 'Jane Smith', score: 1450 },
      { rank: 3, name: 'Bob Johnson', score: 1400 },
      { rank: 4, name: 'Alice Brown', score: 1350 },
      { rank: 5, name: 'Charlie Davis', score: 1300 },
    ]);
  }, []);

  const filteredLeaderboard = leaderboard.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaMedal className="text-yellow-400" />;
      case 2: return <FaMedal className="text-gray-400" />;
      case 3: return <FaMedal className="text-yellow-600" />;
      default: return null;
    }
  };

  const getAvatarColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-400 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-yellow-600 text-white';
      default: return 'bg-indigo-500 text-white';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900">Leaderboard</h1>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-indigo-400" />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-200">
              {filteredLeaderboard.map((user) => (
                <tr key={user.rank} className={`${user.rank <= 3 ? 'bg-indigo-50' : ''} hover:bg-indigo-100 transition duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{user.rank}</span>
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(user.rank)}`}>
                        {getInitials(user.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">{user.score}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
