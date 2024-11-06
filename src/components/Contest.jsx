import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contest = ({ contest }) => {
  const navigate = useNavigate();

  const enterFullScreenAndStartContest = async () => {
    try {
      if (!contest?._id) {
        throw new Error('Invalid contest ID');
      }

      // Request full-screen mode
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      
      // Navigate to contest with the correct path
      navigate(`/student/contests/${contest._id}/participate`);
    } catch (err) {
      console.error('Error entering contest:', err);
      toast.error(err.message || 'Failed to enter contest');
    }
  };

  const handleContestStart = (e) => {
    e.preventDefault();
    if (!contest?._id) {
      toast.error('Invalid contest ID');
      return;
    }
    const status = getContestStatus();
    
    if (status === 'active') {
      enterFullScreenAndStartContest();
    } else {
      toast.error('Contest is not active');
    }
  };

  const formatTimeRemaining = (startTime, duration) => {
    const start = new Date(startTime);
    const now = new Date();
    const end = new Date(start.getTime() + duration * 60000);
    
    if (now < start) {
      const diff = start - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Starts in ${hours}h ${minutes}m`;
    } else if (now > end) {
      return 'Contest ended';
    } else {
      const diff = end - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
  };

  const getContestStatus = () => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(start.getTime() + contest.duration * 60000);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  const status = getContestStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {contest.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {contest.description}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <FaClock className="mr-2" />
          {formatTimeRemaining(contest.startTime, contest.duration)}
        </div>
        <div className="flex items-center">
          <FaTrophy className="mr-2" />
          {contest.problems.length} Problems
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleContestStart}
          className={`inline-block px-4 py-2 rounded-md text-white ${
            status === 'active' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-500 cursor-not-allowed'
          }`}
          disabled={status !== 'active'}
        >
          {status === 'active' ? 'Enter Contest' : 
           status === 'upcoming' ? 'Not Started' : 'Contest Ended'}
        </button>
      </div>
    </div>
  );
};

export default Contest;
