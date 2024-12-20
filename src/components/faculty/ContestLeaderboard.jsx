import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode } from 'react-icons/fa';
import Modal from '../Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContestLeaderboard = () => {
  const [contest, setContest] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/contests/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setContest(response.data);
      } catch (error) {
        console.error('Error fetching contest:', error);
        toast.error('Failed to fetch contest data');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className={`h-8 w-48 mb-6 rounded ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        } animate-pulse`} />
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className={`rounded-lg shadow ${
              darkMode ? 'bg-[#242b3d]' : 'bg-white'
            }`}>
              <div className="h-12 bg-blue-500 rounded-t-lg" />
              
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 p-4 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } border-b last:border-b-0`}
                >
                  <div className={`h-4 w-8 rounded ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } animate-pulse`} />
                  <div className={`h-4 w-32 rounded ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } animate-pulse`} />
                  <div className={`h-4 w-16 rounded ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } animate-pulse`} />
                  <div className={`h-4 w-16 rounded ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } animate-pulse`} />
                  <div className={`hidden sm:block h-4 w-40 rounded ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } animate-pulse`} />
                  <div className={`h-4 w-24 rounded ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } animate-pulse`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getLeaderboardData = () => {
    if (!contest) return [];
    
    return contest.participants.map(participant => {
      const completedProblems = participant.completedProblems || [];
      const totalPoints = completedProblems.length * 100; // Assuming each problem is worth 100 points

      return {
        id: participant.student._id,
        name: participant.student?.name || 'Anonymous',
        problemsSolved: completedProblems.length,
        totalPoints: totalPoints,
        lastSubmission: participant.submissions?.length > 0 
          ? participant.submissions[participant.submissions.length - 1].submittedAt 
          : null,
        submissions: participant.submissions?.map(sub => ({
          ...sub,
          problem: contest.problems.find(p => p.problem._id === sub.problem)?.problem || { title: 'Unknown Problem' }
        })) || []
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const handleViewCode = (participant) => {
    if (!participant.submissions?.length) {
      toast.error('No submissions found for this student');
      return;
    }
    setSelectedSubmission(participant.submissions);
    setShowCodeModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Contest Leaderboard
      </h1>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">RANK</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">STUDENT</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">PROBLEMS</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">POINTS</th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm">LAST SUBMISSION</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">ACTIONS</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200'
            }`}>
              {getLeaderboardData().map((participant, index) => (
                <tr key={participant.id + "-" + index}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{participant.name}</td>
                  <td className="px-6 py-4">{participant.problemsSolved}</td>
                  <td className="px-6 py-4">{participant.totalPoints}</td>
                  <td className="px-6 py-4">
                    {participant.lastSubmission 
                      ? new Date(participant.lastSubmission).toLocaleString()
                      : 'No submissions'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewCode(participant)}
                      className="flex items-center text-blue-500 hover:text-blue-600"
                    >
                      <FaCode className="mr-2" />
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Student Submissions"
      >
        {selectedSubmission && (
          <div className={`space-y-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {selectedSubmission.map((sub, index) => (
              <div key={sub._id || `submission-${index}`} className="border-b last:border-b-0 pb-4">
                <div className="mb-2">
                  <span className="font-semibold">Problem:</span>{' '}
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {sub.problem.title}
                  </span>
                </div>
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                }`}>
                  <code>{sub.code}</code>
                </pre>
                <div className="mt-2 text-sm text-gray-500">
                  Submitted: {new Date(sub.submittedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContestLeaderboard;