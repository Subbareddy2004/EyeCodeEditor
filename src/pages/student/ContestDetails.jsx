import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import ProblemSolver from '../../components/ProblemSolver';

const ContestDetails = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    // Fetch contest details and problems
    // This is a mock implementation. Replace with actual API calls.
    setContest({
      id,
      name: 'Sample Contest',
      duration: '2 hours',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
    });
    setProblems([
      {
        id: '1',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        inputFormat: 'The input consists of a single line containing the string s.',
        outputFormat: 'Output a single integer representing the length of the longest substring without repeating characters.',
        constraints: [
          '0 <= s.length <= 5 * 10^4',
          's consists of English letters, digits, symbols and spaces.'
        ],
        sampleInput: 'abcabcbb',
        sampleOutput: '3'
      },
      { 
        id: '2', 
        title: 'Median of Two Sorted Arrays', 
        difficulty: 'Hard', 
        points: 300, 
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        sampleInput1: '[1,3]\n[2]',
        sampleOutput1: '2.00000',
        sampleInput2: '[1,2]\n[3,4]',
        sampleOutput2: '2.50000'
      },
      { 
        id: '3', 
        title: 'Median of Two Sorted Arrays', 
        difficulty: 'Hard', 
        points: 300, 
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        sampleInput1: '[1,3]\n[2]',
        sampleOutput1: '2.00000',
        sampleInput2: '[1,2]\n[3,4]',
        sampleOutput2: '2.50000'
      },
    ]);
  }, [id]);

  useEffect(() => {
    if (contest) {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(contest.startTime);
        end.setHours(end.getHours() + parseInt(contest.duration));
        const diff = end - now;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining('Contest Ended');
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [contest]);

  if (!contest) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{contest.name}</h1>
      <div className="flex justify-center items-center mb-8">
        <FaClock className="mr-2 text-blue-500" />
        <span className="text-xl font-semibold">{timeRemaining}</span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <div key={problem.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{problem.title}</h2>
              <p className="text-gray-600 mb-4">Difficulty: {problem.difficulty}</p>
              <p className="text-gray-600 mb-4">Points: {problem.points}</p>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => setSelectedProblem(problem)}
              >
                Solve Problem
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedProblem && (
        <ProblemSolver 
          problem={selectedProblem} 
          onClose={() => setSelectedProblem(null)} 
        />
      )}
    </div>
  );
};

export default ContestDetails;
