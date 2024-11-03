import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Editor from '@monaco-editor/react';
import { FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssignmentProblem = () => {
  const { assignmentId, problemId } = useParams();
  const { darkMode } = useTheme();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('py');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    loadProblem();
  }, [assignmentId, problemId]);

  const loadProblem = async () => {
    try {
      const response = await axios.get(`${API_URL}/assignments/${assignmentId}/problems/${problemId}`);
      setProblem(response.data);
      // Set default code template based on language
      setCode(getDefaultCode(response.data.language));
    } catch (error) {
      toast.error('Failed to load problem');
    }
  };

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'py':
        return '# Write your Python code here\n\n';
      case 'cpp':
        return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}';
      case 'java':
        return 'public class Solution {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}';
      case 'js':
        return '// Write your JavaScript code here\n\n';
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/assignments/${assignmentId}/submit`, {
        problemId,
        code,
        language
      });

      setTestResults(response.data.results);
      
      if (response.data.status === 'PASSED') {
        toast.success('All test cases passed!');
      } else {
        toast.error('Some test cases failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit solution');
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {problem.title}
            </h1>
            <div className={`prose ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {problem.description}
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
              <Editor
                height="60vh"
                language={language}
                value={code}
                theme={darkMode ? 'vs-dark' : 'light'}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
            </div>

            <div className="flex justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-4 py-2 rounded ${
                  darkMode ? 'bg-[#242b3d] text-white' : 'bg-white'
                }`}
              >
                <option value="py">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="js">JavaScript</option>
              </select>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-lg flex items-center ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {loading ? (
                  <>
                    <FaPlay className="animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <FaPlay className="mr-2" />
                    Run & Submit
                  </>
                )}
              </button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Test Results
                </h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded ${
                        darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-50'
                      }`}
                    >
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Test Case {index + 1}
                      </span>
                      {result.passed ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Output Console */}
            {output && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Output
                </h3>
                <pre className={`font-mono p-2 rounded ${
                  darkMode ? 'bg-[#1a1f2c] text-gray-300' : 'bg-gray-50 text-gray-600'
                }`}>
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentProblem; 