import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContestTimer = ({ startTime, duration, contestId }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState('waiting');
  const navigate = useNavigate();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = start + (duration * 60 * 1000);

      if (now < start) {
        setStatus('waiting');
        return start - now;
      } else if (now >= start && now <= end) {
        setStatus('running');
        return end - now;
      } else {
        setStatus('ended');
        return 0;
      }
    };

    const timeRemaining = calculateTimeLeft();
    setTimeLeft(timeRemaining);

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, duration]);

  const formatTime = (ms) => {
    if (!ms) return '00:00:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${
        status === 'waiting' ? 'text-yellow-600' :
        status === 'running' ? 'text-green-600' :
        'text-red-600'
      }`}>
        {status === 'waiting' ? 'Contest starts in:' :
         status === 'running' ? 'Time remaining:' :
         'Contest ended'}
      </div>
      <div className="text-xl font-mono mt-2">
        {formatTime(timeLeft)}
      </div>
      {status === 'running' && (
        <button 
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={() => navigate(`/student/contests/${contestId}`)}
        >
          Go to Contest
        </button>
      )}
    </div>
  );
};

export default ContestTimer;