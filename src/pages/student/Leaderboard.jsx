import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getStudentLeaderboard } from '../../services/leaderboardService';
import { useAuth } from '../../contexts/AuthContext';

// Define colors array for user avatars
const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo'];

// Function to get a consistent color for a user based on their ID
const getAvatarColor = (userId) => {
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

// Update the avatar color implementation to use hardcoded classes
const getAvatarBgClass = (userId) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getStudentLeaderboard();
      // Sort students by score in descending order
      const sortedData = data.sort((a, b) => b.score - a.score);
      setStudents(sortedData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find current user's rank
  const currentUserRank = filteredStudents.findIndex(student => student._id === currentUser._id) + 1;

  // Separate current user and other students
  const currentUserData = filteredStudents.find(student => student._id === currentUser._id);
  const otherStudents = filteredStudents.filter(student => student._id !== currentUser._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-900">Leaderboard</h1>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-400" />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">RANK</th>
              <th className="px-6 py-3 text-left">USER</th>
              <th className="px-6 py-3 text-right">SCORE</th>
            </tr>
          </thead>
          <tbody>
            {/* Current User Row */}
            {currentUserData && (
              <tr className="bg-purple-50">
                <td className="px-6 py-4">{currentUserRank}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${getAvatarBgClass(currentUserData._id)} flex items-center justify-center text-white`}>
                      {currentUserData.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{currentUserData.name} <span className="text-purple-600">(You)</span></span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">{currentUserData.score}</td>
              </tr>
            )}
            
            {/* Other Students */}
            {otherStudents.map((student, index) => {
              const rank = index + 1;
              return (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{rank}</span>
                      {rank <= 3 && (
                        <span>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${getAvatarBgClass(student._id)} flex items-center justify-center text-white`}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">{student.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
