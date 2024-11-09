import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import CodeEditor from '../../components/CodeEditor';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LANGUAGE_CONFIG = {
  c: {
    label: 'C',
    template: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}'
  },
  cpp: {
    label: 'C++',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}'
  },
  py: {
    label: 'Python',
    template: '# Your code here'
  },
  java: {
    label: 'Java',
    template: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}'
  },
  js: {
    label: 'JavaScript',
    template: '// Your code here'
  }
};

const ContestView = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [started, setStarted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState(LANGUAGE_CONFIG.c.template);
  const [language, setLanguage] = useState('c');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const { user, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.warn('No authenticated user found');
      toast.error('Please login to view contest details');
      navigate('/login');
      return;
    }

    const fetchContestData = async () => {
      try {
        const response = await axios.get(`/contests/${id}`);
        setContest(response.data);
        
        console.log('Current userId:', userId);
        console.log('All participants:', response.data.participants);
        
        const participant = response.data.participants?.find(
          p => p.student._id === userId
        );
        
        if (participant) {
          console.log('Found participant data:', participant);
          setProblemsSolved(participant.completedProblems?.length || 0);
          setTotalPoints(participant.totalPoints || 0);
        } else {
          console.log('No participant found for userId:', userId);
          setProblemsSolved(0);
          setTotalPoints(0);
        }
      } catch (error) {
        console.error('Error fetching contest:', error);
        toast.error('Error fetching contest details');
      }
    };

    fetchContestData();
  }, [userId]);

  useEffect(() => {
    if (started) {
      const timer = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [started]);

  useEffect(() => {
    if (started) {
      const interval = setInterval(fetchContest, 30000);
      return () => clearInterval(interval);
    }
  }, [started]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(`/contests/${id}`);
      setContest(response.data);
      
      const participant = response.data.participants?.find(
        p => p.student._id === localStorage.getItem('userId')
      );
      
      if (participant) {
        setProblemsSolved(participant.completedProblems?.length || 0);
        setTotalPoints(participant.totalPoints || 0);
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

  const fetchLastSubmission = async (problemId) => {
    try {
      const response = await axios.get(`/contests/${id}/problems/${problemId}/submissions`);
      if (response.data && response.data.code) {
        setCode(response.data.code);
        setLanguage(response.data.language);
      } else {
        setCode(LANGUAGE_CONFIG[language].template);
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
      setCode(LANGUAGE_CONFIG[language].template);
    }
  };

  const handleProblemSelect = async (problem) => {
    setSelectedProblem(problem);
    await fetchLastSubmission(problem.problem._id);
    setOutput('');
    setTestResults(null);
  };

  const handleRunCode = async () => {
    if (!userId) {
      toast.error('Please login to submit solutions');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const runResponse = await axios.post(
        `/contests/${id}/problems/${selectedProblem.problem._id}/run`,
        { code, language }
      );

      console.log('Run response:', runResponse.data);

      if (runResponse.data.results) {
        setTestResults(runResponse.data.results);
        setOutput(runResponse.data.results[0]?.actual || '');
        
        if (runResponse.data.allPassed) {
          await axios.post(
            `/contests/${id}/problems/${selectedProblem.problem._id}/store-submission`,
            { code, language, status: 'PASSED' }
          );

          const completeResponse = await axios.post(
            `/contests/${id}/problems/${selectedProblem.problem._id}/complete`,
            { code, problemId: selectedProblem.problem._id }
          );

          console.log('Complete response:', completeResponse.data);

          if (completeResponse.data) {
            setContest(completeResponse.data);
            const updatedParticipant = completeResponse.data.participants?.find(
              p => p.student._id === userId
            );
            
            console.log('Updated participant data:', updatedParticipant);
            
            if (updatedParticipant) {
              const newProblemsSolved = updatedParticipant.completedProblems?.length || 0;
              const newTotalPoints = updatedParticipant.totalPoints || 0;
              
              console.log('Updating state to:', {
                problemsSolved: newProblemsSolved,
                totalPoints: newTotalPoints
              });
              
              setProblemsSolved(newProblemsSolved);
              setTotalPoints(newTotalPoints);
            }
          }

          toast.success('Problem completed successfully! 🎉');
        }
      }
    } catch (error) {
      console.error('Error running code:', error);
      setError(error.response?.data?.message || 'Error running code');
      toast.error('Failed to run code');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_CONFIG[newLanguage].template);
  };

  const calculateProgress = () => {
    const participant = contest?.participants?.find(
      p => p.student._id === localStorage.getItem('userId')
    );

    if (!participant) {
      return { solved: 0, totalPoints: 0 };
    }

    const solved = participant.completedProblems?.length || 0;
    const totalPoints = participant.totalPoints || 0;

    return { solved, totalPoints };
  };

  const isProblemCompleted = (problemId) => {
    const participant = contest?.participants?.find(
      p => p.student._id === userId
    );
    return participant?.completedProblems?.includes(problemId) || false;
  };

  useEffect(() => {
    console.log('State updated:', {
      problemsSolved,
      totalPoints
    });
  }, [problemsSolved, totalPoints]);

  if (!contest) return <div>Loading...</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {contest?.title}
              </h2>
              <div className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} key={`${problemsSolved}-${totalPoints}`}>
                <p>Total Problems: {contest?.problems?.length || 0}</p>
                <p>Problems Solved: {problemsSolved} / {contest?.problems?.length || 0}</p>
                {/* <p>Total Points: {totalPoints}</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {timeLeft && (
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaClock />
                  <span>{timeLeft}</span>
                </div>
              )}
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Deadline: {new Date(new Date(contest.startTime).getTime() + contest.duration * 60000).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              {contest?.problems?.map((problem, index) => {
                const isCompleted = isProblemCompleted(problem.problem._id);
                return (
                  <div
                    key={problem.problem._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors
                      ${isCompleted ? 'border-l-4 border-green-500' : ''}
                      ${selectedProblem?.problem._id === problem.problem._id 
                        ? isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                        : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => handleProblemSelect(problem)}
                  >
                    <div className="flex items-center justify-between">
                      <div className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                        <span>Problem {index + 1}: </span>
                        <span>{problem.problem.title}</span>
                        {isCompleted && (
                          <span className="ml-2 text-green-500">
                            <FaCheckCircle className="inline-block" /> Completed
                          </span>
                        )}
                      </div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {problem.points} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="md:col-span-2">
              {selectedProblem ? (
                <div className="space-y-4">
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedProblem.problem.title}
                    </h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedProblem.problem.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Sample Input:
                        </h4>
                        <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#f8f9fa] bg-opacity-5 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                          {selectedProblem.problem.sampleInput || 'No sample input provided'}
                        </pre>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Sample Output:
                        </h4>
                        <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#f8f9fa] bg-opacity-5 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                          {selectedProblem.problem.sampleOutput || 'No sample output provided'}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className={`px-3 py-2 rounded ${isDarkMode ? 'bg-white bg-opacity-10 text-white border-0' : 'bg-white text-gray-900 border-gray-300'}`}
                    >
                      {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleRunCode}
                      disabled={loading}
                      className="px-4 py-2 rounded bg-[#0d6efd] hover:bg-[#0b5ed7] text-white"
                    >
                      {loading ? 'Running...' : 'Run Code'}
                    </button>
                  </div>

                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={language}
                    theme={isDarkMode ? "vs-dark" : "light"}
                  />

                  {/* Error Display Box */}
                  {error && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/50' : 'bg-red-50'} border ${isDarkMode ? 'border-red-700' : 'border-red-200'}`}>
                      <div className="flex items-start">
                        <FaExclamationTriangle className={`mt-1 mr-3 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                        <div>
                          <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                            Compilation/Runtime Error
                          </h4>
                          <pre className={`whitespace-pre-wrap font-mono text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                            {error}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test Results */}
                  {testResults && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Test Results:
                      </h4>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded ${
                              result.passed 
                                ? isDarkMode ? 'bg-green-900/50' : 'bg-green-50' 
                                : isDarkMode ? 'bg-red-900/50' : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${
                                result.passed 
                                  ? isDarkMode ? 'text-green-200' : 'text-green-800'
                                  : isDarkMode ? 'text-red-200' : 'text-red-800'
                              }`}>
                                Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            {!result.passed && !result.isHidden && (
                              <div className="mt-2 space-y-1 text-sm">
                                <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  <span className="font-medium">Input:</span> {result.input}
                                </div>
                                <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  <span className="font-medium">Expected:</span> {result.expected}
                                </div>
                                <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  <span className="font-medium">Got:</span> {result.actual || 'No output'}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Output Display */}
                  {output && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Output:
                      </h4>
                      <pre className={`p-3 rounded ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                        {output}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select a problem to start coding
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestView;