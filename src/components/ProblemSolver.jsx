import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlay, FaPaperPlane } from 'react-icons/fa';
import { getProblem } from '../services/problems'; // Assume this service exists

const ProblemSolver = ({ problemId, onClose }) => {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('# cook your dish here');
  const [language, setLanguage] = useState('python3');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const data = await getProblem(problemId);
        setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Failed to load problem. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          {error}
          <button onClick={onClose} className="ml-4 underline">Close</button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return null;
  }

  const handleRun = () => {
    // Simulate running the code
    setOutput({
      testCases: [
        { passed: true, progress: 100 },
        { passed: false, progress: 75 },
        { passed: true, progress: 100 },
      ]
    });
  };

  const renderCodeWithLineNumbers = () => {
    const lines = code.split('\n');
    return (
      <div className="flex">
        <div className="pr-4 text-gray-400 select-none">
          {lines.map((_, index) => (
            <div key={index + 1} className="text-right">{index + 1}</div>
          ))}
        </div>
        <textarea
          className="flex-grow bg-transparent outline-none resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={lines.length}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-6xl h-5/6 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center bg-gray-700 p-4">
          <h2 className="text-xl font-bold text-white">{problem.title}</h2>
          <button onClick={onClose} className="text-white">
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow flex">
          <div className="w-1/2 border-r border-gray-600 overflow-y-auto p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-300">Problem Statement</h3>
            <p className="mb-4 text-gray-300">{problem.description}</p>
            <h4 className="text-lg font-semibold mb-2 text-indigo-300">Input Format</h4>
            <p className="mb-4 text-gray-300">{problem.inputFormat || 'Not specified'}</p>
            <h4 className="text-lg font-semibold mb-2 text-indigo-300">Output Format</h4>
            <p className="mb-4 text-gray-300">{problem.outputFormat || 'Not specified'}</p>
            <h4 className="text-lg font-semibold mb-2 text-indigo-300">Constraints</h4>
            <ul className="list-disc pl-5 mb-4 text-gray-300">
              {problem.constraints && problem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold mb-2 text-indigo-300">Sample Input</h4>
            <pre className="bg-gray-700 p-2 rounded mb-2 text-gray-300">{problem.sampleInput}</pre>
            <h4 className="text-lg font-semibold mb-2 text-indigo-300">Sample Output</h4>
            <pre className="bg-gray-700 p-2 rounded mb-4 text-gray-300">{problem.sampleOutput}</pre>
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="p-4 bg-gray-700">
              <select
                className="bg-gray-800 text-white px-4 py-2 rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="python3">Python 3</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="flex-grow bg-gray-800 p-4 font-mono text-sm overflow-hidden text-gray-300">
              {renderCodeWithLineNumbers()}
            </div>
            <div className="p-4 border-t border-gray-600">
              <h4 className="text-lg font-semibold mb-2 text-indigo-300">Custom Input</h4>
              <textarea
                className="w-full bg-gray-700 p-2 rounded mb-2 text-gray-300"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows="3"
              />
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 flex items-center"
                  onClick={handleRun}
                >
                  <FaPlay className="mr-2" /> Run
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 flex items-center">
                  <FaPaperPlane className="mr-2" /> Submit
                </button>
              </div>
            </div>
            {output && (
              <div className="p-4 border-t border-gray-600">
                <h4 className="text-lg font-semibold mb-2 text-indigo-300">Output</h4>
                {output.testCases.map((testCase, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between mb-1 text-gray-300">
                      <span>Test Case {index + 1}</span>
                      <span>{testCase.passed ? 'Passed' : 'Failed'}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded">
                      <div 
                        className={`h-2 rounded ${testCase.passed ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{width: `${testCase.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;
