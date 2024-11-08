import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import CodeEditor from '../../components/CodeEditor';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchContest();
  }, [id]);

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
    try {
      setLoading(true);
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
        
        if (response.data.allPassed) {
          await handleProblemComplete();
          await fetchContest();
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
      console.log('Completing problem:', selectedProblem.problem._id);
      const response = await axios.post(
        `/contests/${id}/problems/${selectedProblem.problem._id}/complete`,
        { 
          code,
          problemId: selectedProblem.problem._id,
          userId: localStorage.getItem('userId')
        }
      );
      
      if (response.data) {
        setContest(response.data);
        toast.success('Problem completed successfully! 🎉');
      }
    } catch (error) {
      console.error('Error completing problem:', error);
      toast.error('Failed to mark problem as completed');
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
      p => p.student._id === localStorage.getItem('userId')
    );

    return participant?.completedProblems?.includes(problemId) || false;
  };

  if (!contest) return <div>Loading...</div>;

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {contest.title}
            </h2>
            <div className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Problems ({calculateProgress().solved}/{contest.problems.length} Solved)</p>
              <p>Total Points: {calculateProgress().totalPoints}/{contest.problems.reduce((sum, p) => sum + p.points, 0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {timeLeft && (
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                    ${isCompleted 
                      ? isDarkMode ? 'bg-green-800 hover:bg-green-700' : 'bg-green-100 hover:bg-green-200'
                      : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  onClick={() => handleProblemSelect(problem)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Problem {index + 1}: </span>
                      <span>{problem.problem.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{problem.points} pts</span>
                      {isCompleted && <FaCheckCircle className={isDarkMode ? 'text-green-400' : 'text-green-600'} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-2">
            {selectedProblem ? (
              <div className="space-y-4">
                <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedProblem.problem.title}
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedProblem.problem.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Sample Input:
                      </h4>
                      <pre className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedProblem.problem.sampleInput || 'No sample input provided'}
                      </pre>
                    </div>
                    <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Sample Output:
                      </h4>
                      <pre className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedProblem.problem.sampleOutput || 'No sample output provided'}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className={`px-3 py-2 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}
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
                    className={`px-4 py-2 rounded ${
                      loading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {loading ? 'Running...' : 'Run Code'}
                  </button>
                </div>

                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  theme={isDarkMode ? 'vs-dark' : 'light'}
                />

                {output && (
                  <div className={`mt-4 p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Output:
                    </h4>
                    <pre className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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