import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { FaPlay } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { getProblem, runCode } from '../../services/problemService';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { eclipse } from '@uiw/codemirror-theme-eclipse';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { getAuthHeaders } from '../../utils/authUtils';

// Language configuration
const LANGUAGE_CONFIG = {
  cpp: {
    label: 'C++',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    //Write your code here\n    return 0;\n}'
  },
  c: {
    label: 'C',
    template: '#include <stdio.h>\n\nint main() {\n    //Write your code here\n    return 0;\n}'
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

const PracticeProblem = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(LANGUAGE_CONFIG.cpp.template);
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const data = await getProblem(id);
      setProblem(data);
    } catch (error) {
      console.error('Error fetching problem:', error);
      toast.error('Failed to fetch problem details');
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_CONFIG[newLanguage].template);
  };

  const handleRunCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/problems/student/problems/${problem._id}/run`,
        {
          code,
          language
        },
        { headers: getAuthHeaders() }
      );

      // Show test results
      setTestResults([{
        passed: response.data.testCase.passed,
        input: response.data.testCase.input,
        expected: response.data.testCase.expectedOutput,
        actual: response.data.testCase.actualOutput,
        error: response.data.error
      }]);

      // Show success/error toast with output
      if (response.data.testCase.passed) {
        toast.success(
          <div>
            <p>All test cases passed! 🎉</p>
            <p className="text-sm mt-1">Output: {response.data.output}</p>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.error(
          <div>
            <p>Test case failed</p>
            <p className="text-sm mt-1">Expected: {response.data.testCase.expectedOutput}</p>
            <p className="text-sm">Got: {response.data.testCase.actualOutput}</p>
          </div>,
          { duration: 4000 }
        );
      }

    } catch (error) {
      console.error('Error running code:', error);
      toast.error(error.response?.data?.message || 'Failed to run code');
      setTestResults([{
        passed: false,
        error: error.response?.data?.message || 'Failed to run code'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Editor theme configuration
  const editorTheme = darkMode ? vscodeDark : eclipse;

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Left side */}
      <div className={`w-1/2 p-6 overflow-y-auto border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Problem Title and Difficulty */}
        <h1 className="text-2xl font-bold mb-4">{problem?.title}</h1>
        <div className="mb-4">
          <span className={`px-2 py-1 rounded text-sm ${
            problem?.difficulty === 'Easy' ? 'bg-green-600' :
            problem?.difficulty === 'Medium' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {problem?.difficulty}
          </span>
        </div>

        {/* Problem Description */}
        <div className="prose prose-invert mb-6">
          <p>{problem?.description}</p>
        </div>

        {/* Sample Cases */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sample Input:</h3>
            <pre className={`p-3 rounded ${
              darkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}>
              {problem?.sampleInput}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Sample Output:</h3>
            <pre className={`p-3 rounded ${
              darkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}>
              {problem?.sampleOutput}
            </pre>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded ${
                    result.passed ? 'bg-green-900/50' : 'bg-red-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span>Test Case {index + 1}</span>
                    <span>{result.passed ? '✅ Passed' : '❌ Failed'}</span>
                  </div>
                  {!result.isHidden && (
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Input:</span> {result.input}</p>
                      <p><span className="font-medium">Expected:</span> {result.expected}</p>
                      <p><span className="font-medium">Got:</span> {result.actual}</p>
                      {result.error && (
                        <p className="text-red-400 mt-2">
                          <span className="font-medium">Error:</span> {result.error}
                        </p>
                      )}
                    </div>
                  )}
                  {result.isHidden && (
                    <p className="mt-2 text-sm italic">
                      {result.passed ? 'Hidden test case passed' : 'Hidden test case failed'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="w-1/2 flex flex-col">
        {/* Language selector */}
        <div className={`p-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`px-3 py-1 rounded ${
              darkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Code editor */}
        <div className="flex-1 overflow-hidden">
          <CodeMirror
            value={code}
            height="100%"
            theme={editorTheme}
            extensions={[
              language === 'cpp' || language === 'c'
                ? cpp()
                : language === 'java'
                  ? java()
                  : python()
            ]}
            onChange={(value) => setCode(value)}
            className="text-lg"
            options={{
              lineNumbers: true,
              lineWrapping: true,
              autoCloseBrackets: true,
              matchBrackets: true,
              tabSize: 4,
              fontSize: 14,
            }}
          />
        </div>

        {/* Run button */}
        <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <button
            onClick={handleRunCode}
            disabled={loading}
            className={`w-full px-4 py-2 rounded flex items-center justify-center ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <span>Running...</span>
            ) : (
              <>
                <FaPlay className="mr-2" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeProblem;