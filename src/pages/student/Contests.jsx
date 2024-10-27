import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaTrophy, FaSearch } from 'react-icons/fa';
import ContestRulesModal from './ContestRulesModal';
import ProblemSolver from '../../components/ProblemSolver';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  useEffect(() => {
    // Simulating API call
    setContests([
      { id: '1', name: 'Weekly Challenge #1', startTime: '2023-05-15T10:00:00Z', duration: '2 hours', joined: false, problems: [{ id: '1', title: 'Problem 1' }, { id: '2', title: 'Problem 2' }] },
      { id: '2', name: 'Monthly Coding Marathon', startTime: '2023-05-20T09:00:00Z', duration: '4 hours', joined: true, problems: [{ id: '3', title: 'Problem 3' }, { id: '4', title: 'Problem 4' }] },
      { id: '3', name: 'Algorithmic Showdown', startTime: '2023-05-25T14:00:00Z', duration: '3 hours', joined: false, problems: [{ id: '5', title: 'Problem 5' }] },
    ]);
  }, []);

  const filteredContests = contests.filter(contest =>
    contest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900">Contests</h1>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search contests..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-indigo-400" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContests.map((contest) => (
            <div key={contest.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-800">{contest.name}</h2>
              <div className="flex items-center mb-2 text-gray-600">
                <FaCalendarAlt className="mr-2" />
                <span>{new Date(contest.startTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center mb-4 text-gray-600">
                <FaClock className="mr-2" />
                <span>{contest.duration}</span>
              </div>
              {contest.joined ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Problems:</h3>
                  {contest.problems.map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblemId(problem.id)}
                      className="mr-2 mb-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                    >
                      {problem.title}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setSelectedContest(contest)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                >
                  <FaTrophy className="mr-2" /> Enter Contest
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedContest && (
        <ContestRulesModal
          contest={selectedContest}
          onClose={() => setSelectedContest(null)}
          onAccept={() => {
            // Handle contest entry
            setContests(contests.map(c => 
              c.id === selectedContest.id ? {...c, joined: true} : c
            ));
            setSelectedContest(null);
          }}
        />
      )}
      {selectedProblemId && (
        <ProblemSolver
          problemId={selectedProblemId}
          onClose={() => setSelectedProblemId(null)}
        />
      )}
    </div>
  );
};

export default Contests;