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
  const { darkMode } = useTheme();
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const { user, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !user) {
      toast.error('Please login to view contest details');
      navigate('/login');
      return;
    }

    const fetchContestData = async () => {
      try {
        const response = await axios.get(`/contests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        
        if (!response.data) {
          toast.error('Contest not found');
          navigate('/student/contests');
          return;
        }

        setContest(response.data);
        
        const participant = response.data.participants?.find(
          p => p.student._id === userId
        );
        
        if (participant) {
          setProblemsSolved(participant.completedProblems?.length || 0);
          setTotalPoints(participant.totalPoints || 0);
        } else {
          setProblemsSolved(0);
          setTotalPoints(0);
        }
      } catch (error) {
        console.error('Error fetching contest:', error);
        toast.error(error.response?.data?.message || 'Error fetching contest details');
        navigate('/student/contests');
      }
    };

    fetchContestData();
  }, [userId, user, id, navigate]);

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
      const response = await axios.get(`/contests/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.data) return;
      
      setContest(response.data);
      
      const participant = response.data.participants?.find(
        p => p.student._id === userId
      );
      
      if (participant) {
        setProblemsSolved(participant.completedProblems?.length || 0);
        setTotalPoints(participant.totalPoints || 0);
      }
    } catch (error) {
      console.error('Error fetching contest:', error);
      toast.error('Error updating contest data');
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

  useEffect(() => {
    if (selectedProblem) {
      fetchLastSubmission(selectedProblem.problem._id);
    }
  }, [selectedProblem]);

  const fetchLastSubmission = async (problemId) => {
    try {
      const response = await axios.get(
        `/contests/${id}/problems/${problemId}/submissions`
      );
      
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
    if (!userId || !user) {
      toast.error('Please login to submit solutions');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const runResponse = await axios.post(
        `/contests/${id}/problems/${selectedProblem.problem._id}/run`,
        { code, language },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
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
        } else {
          await axios.post(
            `/contests/${id}/problems/${selectedProblem.problem._id}/store-submission`,
            { code, language, status: 'FAILED' }
          );
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

  if (!user || !userId) {
    return null; // or a loading spinner
  }

  if (!contest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-7xl mx-auto ${darkMode ? 'bg-[#242b3d]' : 'bg-white'} shadow-lg rounded-lg`}>
        {/* Header Section */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b ${
          darkMode ? 'border-[#2d3548]' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {contest?.title}
            </h2>
            <div className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Total Problems: {contest?.problems?.length || 0}</p>
              <p>Problems Solved: {problemsSolved} / {contest?.problems?.length || 0}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {timeLeft && (
              <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <FaClock />
                <span>{timeLeft}</span>
              </div>
            )}
            <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Deadline: {new Date(new Date(contest.startTime).getTime() + contest.duration * 60000).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Mobile Problem Selector */}
        <div className="block lg:hidden p-4">
          <select
            value={selectedProblem?.problem._id || ''}
            onChange={(e) => {
              const problem = contest?.problems?.find(p => p.problem._id === e.target.value);
              if (problem) handleProblemSelect(problem);
            }}
            className={`w-full p-3 rounded-lg ${
              darkMode ? 'bg-[#1a1f2c] text-white border-[#2d3548]' : 'bg-gray-100 text-gray-900'
            }`}
          >
            <option value="">Select a Problem</option>
            {contest?.problems?.map((problem, index) => (
              <option key={problem.problem._id} value={problem.problem._id}>
                Problem {index + 1}: {problem.problem.title} 
                {isProblemCompleted(problem.problem._id) ? ' (Completed)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
          {/* Problem List - Desktop */}
          <div className="hidden lg:block space-y-2">
            {contest?.problems?.map((problem, index) => {
              const isCompleted = isProblemCompleted(problem.problem._id);
              return (
                <div
                  key={problem.problem._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors
                    ${isCompleted ? 'border-l-4 border-green-500' : ''}
                    ${selectedProblem?.problem._id === problem.problem._id 
                      ? darkMode ? 'bg-blue-900/50 text-blue-100' : 'bg-blue-100 text-blue-800'
                      : darkMode ? 'bg-[#1a1f2c] hover:bg-[#2d3548]' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => handleProblemSelect(problem)}
                >
                  <div className="flex items-center justify-between">
                    <div className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                      <span>Problem {index + 1}: </span>
                      <span>{problem.problem.title}</span>
                      {isCompleted && (
                        <span className="ml-2 text-green-500">
                          <FaCheckCircle className="inline-block" /> Completed
                        </span>
                      )}
                    </div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {problem.points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Problem Details and Editor */}
          <div className="lg:col-span-2">
            {selectedProblem ? (
              <div className="space-y-6">
                {/* Problem Description */}
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedProblem.problem.title}
                  </h3>
                  <p className={`mb-6 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedProblem.problem.description}
                  </p>
                  
                  {/* Sample Cases */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Sample Input:
                      </h4>
                      <pre className={`p-2 rounded text-sm overflow-x-auto ${
                        darkMode ? 'bg-[#242b3d] text-gray-300' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {selectedProblem.problem.sampleInput || 'No sample input provided'}
                      </pre>
                    </div>
                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Sample Output:
                      </h4>
                      <pre className={`p-2 rounded text-sm overflow-x-auto ${
                        darkMode ? 'bg-[#242b3d] text-gray-300' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {selectedProblem.problem.sampleOutput || 'No sample output provided'}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Code Editor Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className={`w-full sm:w-auto px-3 py-2 rounded ${
                        darkMode ? 'bg-[#1a1f2c] text-white border-[#2d3548]' : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    >
                      {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleRunCode}
                      disabled={loading}
                      className={`w-full sm:w-auto px-4 py-2 rounded text-white transition-colors ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      } disabled:opacity-50`}
                    >
                      {loading ? 'Running...' : 'Run Code'}
                    </button>
                  </div>

                  {/* Code Editor */}
                  <div className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border border-[#2d3548]">
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={language}
                      theme={darkMode ? "vs-dark" : "light"}
                    />
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    {error && (
                      <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
                      } border`}>
                        <div className="flex items-start">
                          <FaExclamationTriangle className={`mt-1 mr-3 ${
                            darkMode ? 'text-red-400' : 'text-red-500'
                          }`} />
                          <div>
                            <h4 className={`font-medium mb-1 ${
                              darkMode ? 'text-red-200' : 'text-red-800'
                            }`}>
                              Compilation/Runtime Error
                            </h4>
                            <pre className={`whitespace-pre-wrap font-mono text-sm ${
                              darkMode ? 'text-red-300' : 'text-red-700'
                            }`}>
                              {error}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Test Results */}
                    {testResults && (
                      <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
                      }`}>
                        <h4 className={`font-medium mb-2 ${
                          darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          Test Results:
                        </h4>
                        <div className="space-y-2">
                          {testResults.map((result, index) => (
                            <div 
                              key={index}
                              className={`p-3 rounded ${
                                result.passed 
                                  ? darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'
                                  : darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
                              } border`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${
                                  result.passed 
                                    ? darkMode ? 'text-green-200' : 'text-green-800'
                                    : darkMode ? 'text-red-200' : 'text-red-800'
                                }`}>
                                  Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                                </span>
                              </div>
                              {!result.passed && !result.isHidden && (
                                <div className="mt-2 space-y-1 text-sm">
                                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    <span className="font-medium">Input:</span> {result.input}
                                  </div>
                                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    <span className="font-medium">Expected:</span> {result.expected}
                                  </div>
                                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
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
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#1a1f2c]' : 'bg-white'}`}>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          Output:
                        </h4>
                        <pre className={`p-3 rounded ${
                          darkMode ? 'bg-[#242b3d] text-gray-300' : 'bg-gray-50 text-gray-700'
                        }`}>
                          {output}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] sm:h-[400px]">
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select a problem to start coding
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestView;