import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaTrophy } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthHeaders } from '../../utils/authUtils';
import Confetti from 'react-confetti';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContestResults = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    fetchResults();
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [id]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/student/contests/${id}/results`,
        { headers: getAuthHeaders() }
      );
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${
        darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-800'
      }`}>
        <FaSpinner className="animate-spin text-3xl mr-2" />
        <span>Loading results...</span>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'} min-h-screen`}>
      {showConfetti && <Confetti />}
      
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <h1 className="text-3xl font-bold mb-2">Contest Results</h1>
          <p className="text-xl">Thank you for participating!</p>
        </div>

        <div className={`rounded-lg shadow-md ${
          darkMode ? 'bg-[#242b3d]' : 'bg-white'
        } p-8`}>
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-2 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {results.totalPoints} points
            </div>
            <div className={`text-lg ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your total score
            </div>
          </div>

          <div className="space-y-6">
            {results.problems.map((problem, index) => (
              <div
                key={problem._id}
                className={`p-4 rounded-lg ${
                  problem.solved
                    ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                    : darkMode ? 'bg-red-900/20' : 'bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Problem {index + 1}: {problem.title}
                  </h3>
                  <span className={`font-mono ${
                    problem.solved
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {problem.points} / {problem.maxPoints} points
                  </span>
                </div>
                
                {problem.feedback && (
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {problem.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestResults; 