import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode, FaClock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
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

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    const defaultLanguage = problem.language || 'python';
    setSelectedLanguage(defaultLanguage);
    setCode(LANGUAGE_CONFIG[defaultLanguage]?.template || '');
    setResults(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    setResults(null);

    try {
      const response = await axios.post(`${API_URL}/assignments/${assignmentId}/submit`, {
        problemId: selectedProblem._id,
        code,
        language: selectedLanguage
      });

      setResults(response.data);
      
      if (response.data.success) {
        loadAssignment();
        toast.success('Solution submitted successfully!');
      } else {
        toast.error('Some test cases failed. Check the results below.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Error submitting solution');
    } finally {
      setIsSubmitting(false);
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
                    {results && (
                      <div className={`flex-1 mr-4 p-4 rounded-lg ${
                        results.success 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        <h3 className="font-semibold mb-2">
                          {results.success ? 'Success!' : 'Test Case Failed'}
                        </h3>
                        <div className="font-mono text-sm">
                          {results.failedTestCase && (
                            <>
                              <p>Input:</p>
                              <pre className="bg-white bg-opacity-50 p-2 rounded mt-1">
                                {results.failedTestCase.input}
                              </pre>
                              <p className="mt-2">Your Output:</p>
                              <pre className="bg-white bg-opacity-50 p-2 rounded mt-1">
                                {results.failedTestCase.actualOutput}
                              </pre>
                              <p className="mt-2">Expected Output:</p>
                              <pre className="bg-white bg-opacity-50 p-2 rounded mt-1">
                                {results.failedTestCase.expectedOutput}
                              </pre>
                            </>
                          )}
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