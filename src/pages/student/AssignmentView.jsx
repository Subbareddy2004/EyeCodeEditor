import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode, FaClock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CodeEditor from '../../components/CodeEditor';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LANGUAGE_CONFIG = {
  cpp: {
    label: 'C++',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
  },
  c: {
    label: 'C',
    template: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}'
  },
  python: {
    label: 'Python',
    template: '# Write your code here'
  },
  java: {
    label: 'Java',
    template: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}'
  }
};

const AssignmentView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState(null);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setResults(null);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setCode(LANGUAGE_CONFIG[newLanguage]?.template || '');
    setResults(null);
  };

  const fetchLastSubmission = async (problemId) => {
    try {
      const response = await axios.get(`${API_URL}/assignments/${assignmentId}/submissions/${problemId}`);
      if (response.data && response.data.code) {
        setCode(response.data.code);
        setSelectedLanguage(response.data.language);
      } else {
        // Set default template if no submission exists
        setCode(LANGUAGE_CONFIG[selectedLanguage]?.template || '');
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
      setCode(LANGUAGE_CONFIG[selectedLanguage]?.template || '');
    }
  };

  const handleProblemSelect = async (problem) => {
    setSelectedProblem(problem);
    const defaultLanguage = problem.language || 'python';
    setSelectedLanguage(defaultLanguage);
    await fetchLastSubmission(problem._id);
    setResults(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    setResults(null);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/assignments/${assignmentId}/submit`, {
        problemId: selectedProblem._id,
        code,
        language: selectedLanguage
      });

      // Store submission regardless of result
      await storeSubmission(selectedProblem._id, code, selectedLanguage, response.data.success);
      
      setResults(response.data);
      
      if (response.data.results) {
        setTestResults(response.data.results);
        const compilationError = response.data.results[0]?.error;
        if (compilationError) {
          setError(compilationError);
          toast.error('Compilation error occurred');
        } else if (response.data.success) {
          loadAssignment();
          toast.success('Solution submitted successfully!');
        } else {
          toast.error('Some test cases failed. Check the results below.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.message || 'Error submitting solution');
      toast.error(error.response?.data?.message || 'Error submitting solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const storeSubmission = async (problemId, code, language, passed) => {
    try {
      await axios.post(`${API_URL}/assignments/${assignmentId}/store-submission`, {
        problemId,
        code,
        language,
        status: passed ? 'PASSED' : 'FAILED'
      });
    } catch (error) {
      console.error('Error storing submission:', error);
    }
  };

  const loadAssignment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/assignments/${assignmentId}`);
      console.log('Assignment data:', response.data);
      console.log('First problem test cases:', response.data.problems[0]?.testCases);
      
      setAssignment(response.data);
      if (response.data.problems && response.data.problems.length > 0) {
        const firstProblem = response.data.problems[0];
        console.log('Selected problem:', firstProblem);
        setSelectedProblem(firstProblem);
        setSelectedLanguage(firstProblem.language || 'python');
        await fetchLastSubmission(firstProblem._id);
      }
    } catch (error) {
      console.error('Error loading assignment:', error);
      toast.error('Error loading assignment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/assignments/${assignmentId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setAssignment(response.data);
        setTotalPoints(response.data.totalPoints);
        setEarnedPoints(response.data.earnedPoints);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        toast.error('Error loading assignment');
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId, user.token]);

  useEffect(() => {
    if (selectedProblem) {
      const defaultLanguage = selectedProblem.language || 'python';
      setSelectedLanguage(defaultLanguage);
      setCode(LANGUAGE_CONFIG[defaultLanguage]?.template || '');
    }
  }, [selectedProblem]);

  const isProblemSolved = (problemId) => {
    const problem = assignment?.problems?.find(p => p._id === problemId);
    return problem?.solved || false;
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/student/assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode ? 'text-gray-300 hover:bg-[#242b3d]' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaArrowLeft /> Back to Assignments
          </button>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FaClock className="inline mr-2" />
            Due: {new Date(assignment?.dueDate).toLocaleString()}
          </div>
        </div>
        <h1 className={`text-3xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {assignment?.title}
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Created by: {assignment?.createdBy?.name}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
        {/* Problems List */}
        <div className="col-span-1">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Problems ({assignment?.problemsSolved || 0}/{assignment?.totalProblems || 0} Solved)
              </h2>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Points: {assignment?.earnedPoints || 0}/{assignment?.totalPoints || 0}
              </div>
            </div>
            <div className="space-y-2">
              {assignment?.problems?.map((problem, index) => (
                <div
                  key={problem._id}
                  onClick={() => handleProblemSelect(problem)}
                  className={`p-4 cursor-pointer rounded-lg ${
                    darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
                  } ${
                    selectedProblem?._id === problem._id
                      ? darkMode
                        ? 'ring-2 ring-blue-500'
                        : 'ring-2 ring-blue-400'
                      : 'hover:bg-opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Problem {index + 1}: {problem.title}
                      </h3>
                      {problem.solved && (
                        <span className="text-green-500 text-sm flex items-center mt-1">
                          <FaCheckCircle className="mr-1" /> Completed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Points: {problem.points || 10}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Details and Code Editor */}
        <div className="col-span-3">
          {selectedProblem ? (
            <div className={`rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedProblem.title}
                </h2>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Description
                  </h3>
                  <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedProblem.description}
                  </p>
                </div>

                {/* Sample Test Cases */}
                {selectedProblem.testCases && selectedProblem.testCases.length > 0 && (
                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Sample Test Cases
                    </h3>
                    {selectedProblem.testCases.map((testCase, index) => (
                      <div key={index} className={`mb-4 p-4 rounded ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
                        <div className="mb-2">
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Input:
                          </span>
                          <pre className={`mt-1 p-2 rounded ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Expected Output:
                          </span>
                          <pre className={`mt-1 p-2 rounded ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
                            {testCase.output}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Editor Section */}
                <div className="mb-6">
                  <div className="flex justify-end mb-4">
                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className={`px-3 py-1 rounded ${
                        darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {Object.entries(LANGUAGE_CONFIG).map(([value, { label }]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <CodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    language={selectedLanguage}
                    theme={darkMode ? 'vs-dark' : 'light'}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    {/* Error Display */}
                    {error && (
                      <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-red-900/50' : 'bg-red-50'} border ${darkMode ? 'border-red-700' : 'border-red-200'}`}>
                        <div className="flex items-start">
                          <FaExclamationTriangle className={`mt-1 mr-3 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                          <div>
                            <h4 className={`font-medium mb-1 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                              Compilation/Runtime Error
                            </h4>
                            <pre className={`whitespace-pre-wrap font-mono text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                              {error}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Test Results */}
                    {testResults && (
                      <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          Test Results:
                        </h4>
                        <div className="space-y-2">
                          {testResults.map((result, index) => (
                            <div 
                              key={index}
                              className={`p-3 rounded ${
                                result.passed 
                                  ? darkMode ? 'bg-green-900/50' : 'bg-green-50' 
                                  : darkMode ? 'bg-red-900/50' : 'bg-red-50'
                              }`}
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

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`px-6 py-2 rounded-lg text-white font-semibold ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed'
                          : darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Select a problem to start coding
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentView; 