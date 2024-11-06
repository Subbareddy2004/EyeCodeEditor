import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaTrophy, FaClock, FaCalendar, FaHourglassHalf, FaPlay, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthHeaders } from '../../utils/authUtils';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import ContestRulesModal from './ContestRulesModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const ContestTimer = ({ startTime, duration }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const end = start + (duration * 60 * 1000); // Convert minutes to milliseconds
      
      if (now < start) {
        // Contest hasn't started
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `Starts in ${days}d ${hours}h ${minutes}m`;
      } else if (now > end) {
        // Contest has ended
        return 'Contest ended';
      } else {
        // Contest is ongoing
        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s remaining`;
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, duration]);

  return (
    <div className="flex items-center">
      <FaClock className="mr-2 text-gray-400" />
      <span className="text-gray-300">{timeLeft}</span>
    </div>
  );
};

const ContestCard = ({ contest }) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const getContestStatus = () => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(startTime.getTime() + contest.duration * 60000);

    if (now < startTime) {
      return 'Upcoming';
    } else if (now > endTime) {
      return 'Completed';
    }
    return 'Active';
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setShowRulesModal(true);
  };

  const handleAcceptRules = async () => {
    setIsLoading(true);
    try {
      // Navigate to contest participation
      navigate(`/student/contests/${contest._id}/participate`);
    } catch (error) {
      console.error('Error starting contest:', error);
      toast.error('Failed to start contest');
    } finally {
      setIsLoading(false);
    }
  };

  const status = getContestStatus(contest);

  return (
    <>
      {showRulesModal && (
        <ContestRulesModal
          contest={contest}
          onClose={() => setShowRulesModal(false)}
          onAccept={handleAcceptRules}
        />
      )}

      <div className={`relative overflow-hidden rounded-xl ${
        darkMode ? 'bg-[#242b3d]' : 'bg-white'
      } shadow-lg hover:shadow-xl transition-all duration-300 border ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Active' 
            ? 'bg-green-500/20 text-green-400'
            : status === 'Upcoming'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-gray-500/20 text-gray-400'
        }`}>
          {status}
        </div>

        <div className="p-6">
          {/* Title and Description */}
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{contest.title}</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{contest.description}</p>
          
          {/* Contest Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <FaCalendar className="text-blue-500 mr-3 text-lg" />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {new Date(contest.startTime).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center">
              <FaHourglassHalf className="text-purple-500 mr-3 text-lg" />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Duration: {formatTime(contest.duration)}
              </span>
            </div>
            <div className="flex items-center">
              <FaClock className="text-green-500 mr-3 text-lg" />
              <ContestTimer startTime={contest.startTime} duration={contest.duration} />
            </div>
            <div className="flex items-center">
              <FaTrophy className="text-yellow-500 mr-3 text-lg" />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {contest.problems?.length || 0} Problems
              </span>
            </div>
          </div>

          {/* Action Button */}
          {status === 'Active' && (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700 text-white rounded-lg 
                font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <>
                  <FaPlay className="text-lg" />
                  <span>Start Contest</span>
                </>
              )}
            </button>
          )}

          {status === 'Upcoming' && (
            <button disabled 
              className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg 
                font-medium opacity-75 cursor-not-allowed flex items-center 
                justify-center space-x-2"
            >
              <FaClock className="text-lg" />
              <span>Not Started Yet</span>
            </button>
          )}

          {status === 'Completed' && (
            <button disabled 
              className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg 
                font-medium opacity-75 cursor-not-allowed flex items-center 
                justify-center space-x-2"
            >
              <FaCheck className="text-lg" />
              <span>Contest Ended</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  const fetchContests = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/student/contests`,
        { headers: getAuthHeaders() }
      );
      setContests(response.data);
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast.error('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${
        darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-800'
      }`}>
        <FaSpinner className="animate-spin text-3xl mr-2" />
        <span>Loading contests...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <FaTrophy className="inline-block mr-3 text-yellow-500" />
            Active Contests
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.map(contest => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contests;