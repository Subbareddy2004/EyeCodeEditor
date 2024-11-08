import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import CodeEditor from '../../components/CodeEditor';

const LANGUAGE_CONFIG = {
  cpp: {
    label: 'C++',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}'
  },
  python: {
    label: 'Python',
    template: '# Your code here'
  },
  java: {
    label: 'Java',
    template: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}'
  },
  javascript: {
    label: 'JavaScript',
    template: '// Your code here'
  }
};

const ContestView = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [started, setStarted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState(LANGUAGE_CONFIG.cpp.template);
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchContest();
  }, [id]);

  useEffect(() => {
    if (started) {
      const timer = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [started]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(`/contests/${id}`);
      setContest(response.data);
      
      const participant = response.data.participants?.find(
        p => p.student?._id === localStorage.getItem('userId')
      );
      
      if (participant) {
        setStarted(true);
        updateTimeLeft(participant.startTime);
      }
    } catch (error) {
      toast.error('Error fetching contest');
    }
  };

  const updateTimeLeft = (startTime) => {
    if (!contest) return;
    const start = new Date(startTime);
    const now = new Date();
    const endTime = new Date(start.getTime() + contest.duration * 60000);
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
      setTimeLeft('Contest ended');
      return;
    }

    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleStartContest = async () => {
    try {
      await axios.post(`/contests/${id}/start`);
      setStarted(true);
      fetchContest();
    } catch (error) {
      toast.error('Error starting contest');
    }
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setCode(LANGUAGE_CONFIG[language].template);
    setOutput('');
    setTestResults(null);
  };

  const handleRunCode = async () => {
    if (!selectedProblem || !code.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `/contests/${id}/problems/${selectedProblem.problem._id}/run`,
        {
          code,
          language
        }
      );

      if (response.data.results) {
        setTestResults(response.data.results);
        setOutput(response.data.results[0]?.actual || '');
        
        const allPassed = response.data.results.every(r => r.passed);
        if (allPassed) {
          toast.success('All test cases passed! 🎉');
          await handleProblemComplete();
          await fetchContest(); // Refresh contest data to update UI
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error running code';
      setOutput(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemComplete = async () => {
    try {
      const response = await axios.post(
        `/contests/${id}/problems/${selectedProblem.problem._id}/complete`,
        { code }
      );
      setContest(response.data);
      
      toast.success('Problem marked as completed!');
    } catch (error) {
      toast.error('Error updating problem status');
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_CONFIG[newLanguage].template);
  };

  const calculateProgress = () => {
    if (!contest || !contest.participants) return { solved: 0, totalPoints: 0 };
    
    const participant = contest.participants.find(
      p => p.student._id === localStorage.getItem('userId')
    );
    
    if (!participant) return { solved: 0, totalPoints: 0 };
    
    return {
      solved: participant.completedProblems.length,
      totalPoints: participant.totalPoints
    };
  };

  const isProblemCompleted = (problemId) => {
    if (!contest || !contest.participants) return false;
    
    const participant = contest.participants.find(
      p => p.student._id === localStorage.getItem('userId')
    );
    
    return participant?.completedProblems.includes(problemId);
  };

  if (!contest) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{contest.title}</h2>
            <div className="text-gray-400 mt-2">
              <p>Problems ({calculateProgress().solved}/{contest.problems.length} Solved)</p>
              <p>Total Points: {calculateProgress().totalPoints}/{contest.problems.reduce((sum, p) => sum + p.points, 0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {timeLeft && (
              <div className="flex items-center gap-2 text-gray-400">
                <FaClock />
                <span>{timeLeft}</span>
              </div>
            )}
            {!started && (
              <button
                onClick={handleStartContest}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Start Contest
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            {contest.problems.map((problem, index) => {
              const isCompleted = isProblemCompleted(problem.problem._id);
              return (
                <div
                  key={problem.problem._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedProblem?.problem._id === problem.problem._id ? 'ring-2 ring-blue-500' : ''}
                    ${isCompleted ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => handleProblemSelect(problem)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Problem {index + 1}: </span>
                      <span>{problem.problem.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{problem.points} pts</span>
                      {isCompleted && <FaCheckCircle className="text-green-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-2">
            {selectedProblem ? (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedProblem.problem.title}
                  </h3>
                  <p className="text-gray-300">{selectedProblem.problem.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded"
                  >
                    {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRunCode}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Running...' : 'Run Code'}
                  </button>
                </div>

                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  className="h-64"
                />

                {output && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Output:</h4>
                    <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
                  </div>
                )}

                {testResults && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white">Test Results:</h4>
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded ${
                          result.passed ? 'bg-green-900' : 'bg-red-900'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>Test Case {index + 1}</span>
                          <span>{result.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                        {!result.passed && (
                          <div className="mt-2 text-sm">
                            <div>Expected: {result.expected}</div>
                            <div>Got: {result.actual}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a problem to begin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestView;