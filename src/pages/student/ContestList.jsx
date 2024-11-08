import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await axios.get('/contests');
      setContests(response.data);
    } catch (error) {
      toast.error('Error fetching contests');
    } finally {
      setLoading(false);
    }
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(startTime.getTime() + contest.duration * 60000);

    if (now < startTime) {
      return {
        status: 'Upcoming',
        color: 'text-yellow-500'
      };
    } else if (now > endTime) {
      return {
        status: 'Ended',
        color: 'text-red-500'
      };
    } else {
      return {
        status: 'Ongoing',
        color: 'text-green-500'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Contests</h1>
      
      {contests.length === 0 ? (
        <div className="text-center text-gray-500">
          No contests available at the moment.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contests.map(contest => {
            const { status, color } = getContestStatus(contest);
            return (
              <div
                key={contest._id}
                className={`${
                  darkMode 
                    ? 'bg-[#2d3548] hover:bg-[#374151]' 
                    : 'bg-white hover:bg-gray-50'
                } p-6 rounded-lg shadow-md transition duration-300 cursor-pointer`}
                onClick={() => navigate(`/student/contests/${contest._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{contest.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                    {status}
                  </span>
                </div>
                
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {contest.description}
                </p>
                
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    <span className="font-medium">Start Time:</span>{' '}
                    {new Date(contest.startTime).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{' '}
                    {contest.duration} minutes
                  </p>
                  <p>
                    <span className="font-medium">Problems:</span>{' '}
                    {contest.problems.length}
                  </p>
                </div>

                <button
                  className={`mt-4 w-full py-2 px-4 rounded ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition duration-300`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/contests/${contest._id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContestList;