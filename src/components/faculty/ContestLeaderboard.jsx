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
  const { id } = useParams();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${API_URL}/contests/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setContest(response.data);
      } catch (error) {
        console.error('Error fetching contest:', error);
        toast.error('Failed to fetch contest data');
      }
    };

    fetchContest();
  }, [id]);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Contest Leaderboard
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">RANK</th>
              <th className="px-6 py-3 text-left">STUDENT</th>
              <th className="px-6 py-3 text-left">PROBLEMS SOLVED</th>
              <th className="px-6 py-3 text-left">TOTAL POINTS</th>
              <th className="px-6 py-3 text-left">LAST SUBMISSION</th>
              <th className="px-6 py-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200'}`}>
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