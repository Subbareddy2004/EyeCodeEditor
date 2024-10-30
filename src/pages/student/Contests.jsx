import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContests, joinContest } from '../../services/contestService';
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import Modal from '../../components/Modal';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadContests();
    const timer = setInterval(loadContests, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadContests = async () => {
    try {
      const data = await getContests();
      const contestsWithTime = data.map(contest => ({
        ...contest,
        timeRemaining: getTimeRemaining(contest.startTime)
      }));
      setContests(contestsWithTime);
    } catch (error) {
      toast.error('Failed to load contests');
    }
  };

  const getTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return 'Contest Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleRegisterClick = (contest) => {
    setSelectedContest(contest);
    setShowTerms(true);
  };

  const handleAcceptTerms = async () => {
    try {
      await joinContest(selectedContest._id);
      setShowTerms(false);
      setShowConfetti(true);
      toast.success('Successfully joined the contest!');
      await loadContests();
      setTimeout(() => {
        setShowConfetti(false);
        loadContests();
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join contest');
    }
  };

  const isUserRegistered = (contest) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !contest.participants) return false;

    return contest.participants.some(p => {
      if (!p || !p.user) return false;
      const participantId = p.user._id || p.user;
      return participantId && participantId.toString() === userId.toString();
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-8">Contests</h1>
        
        <input
          type="text"
          placeholder="Search contests..."
          className="w-full max-w-md px-4 py-2 rounded-lg border mb-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            if (!contest) return null;
            const registered = isUserRegistered(contest);
            
            return (
              <div key={contest._id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">
                  {contest.title || 'Untitled Contest'}
                </h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    {contest.startTime ? new Date(contest.startTime).toLocaleString() : 'Date TBD'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    {contest.duration || 0} minutes
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="mr-2" />
                    {(contest.participants?.length || 0)} Participants
                  </div>
                </div>

                <div className="text-purple-600 font-semibold mb-4">
                  {contest.timeRemaining || 'Time not set'}
                </div>

                <button
                  onClick={() => handleRegisterClick(contest)}
                  disabled={registered}
                  className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-all transform hover:scale-105 ${
                    registered
                      ? 'bg-green-500 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {registered ? 'Joined' : 'Register'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Contest Terms & Conditions"
      >
        <div className="p-6">
          <div className="mb-6 space-y-4 text-gray-700">
            <h3 className="font-bold text-xl mb-4">Please read and accept the following terms:</h3>
            <p>1. You agree to follow all contest rules and guidelines.</p>
            <p>2. You will not share solutions during the contest.</p>
            <p>3. You will not use any unauthorized resources or external help.</p>
            <p>4. Your submission will be your original work.</p>
            <p>5. Violation of these terms may result in disqualification.</p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowTerms(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptTerms}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Accept & Join
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Contests;