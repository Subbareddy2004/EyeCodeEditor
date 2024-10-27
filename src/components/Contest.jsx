import React from 'react';
import { Link } from 'react-router-dom';

const Contest = ({ name, startTime, duration, link }) => {
  const getTimeRemaining = () => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} days ${hours} hrs`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">Start in: {getTimeRemaining()}</p>
        <p className="text-gray-600">Duration: {duration}</p>
      </div>
      <Link to={link} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        View Contest
      </Link>
    </div>
  );
};

export default Contest;
