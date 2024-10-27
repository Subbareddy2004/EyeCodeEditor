import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, submitSolution } from '../../services/problems';
import { FaPlay, FaPaperPlane, FaTimes } from 'react-icons/fa';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';

const ProblemSolving = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('# cook your dish here');
  const [language, setLanguage] = useState('python3');
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem(id);
        setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setProblem({
          title: 'Longest Substring Without Repeating Characters',
          description: 'Given a string s, find the length of the longest substring without repeating characters.',
          difficulty: 'Medium',
          timeRemaining: '02:30:00',
          inputFormat: 'Not specified',
          outputFormat: 'Not specified',
          constraints: '',
          sampleInput: '',
          sampleOutput: '',
        });
        setError('Failed to load problem. Using dummy data.');
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const submission = await submitSolution(id, code, language);
      setResult(submission);
    } catch (error) {
      setError('Failed to submit solution.');
    }
  };

  const handleRun = () => {
    console.log('Running code...');
    // Implement code execution logic here
  };

  if (!problem) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-indigo-700 py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaTimes className="mr-4 cursor-pointer" onClick={() => navigate('/problems')} />
          <h1 className="text-xl font-bold">{problem.title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-yellow-600 text-white px-2 py-1 rounded">Difficulty: {problem.difficulty}</span>
          <span>Time Remaining: {problem.timeRemaining}</span>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r border-gray-700">
          <div className="p-4">
            <section>
              <h2 className="text-lg font-semibold mb-2">Problem Statement</h2>
              <p className="mb-4">{problem.description}</p>
            </section>
            <section>
              <h3 className="text-md font-semibold mt-4 mb-2">Input Format</h3>
              <p className="mb-4">{problem.inputFormat}</p>
            </section>
            <section>
              <h3 className="text-md font-semibold mt-4 mb-2">Output Format</h3>
              <p className="mb-4">{problem.outputFormat}</p>
            </section>
            <section>
              <h3 className="text-md font-semibold mt-4 mb-2">Constraints</h3>
              <p className="mb-4">{problem.constraints}</p>
            </section>
            <section>
              <h3 className="text-md font-semibold mt-4 mb-2">Sample Input</h3>
              <pre className="bg-gray-700 p-4 rounded mb-4">{problem.sampleInput}</pre>
            </section>
            <section>
              <h3 className="text-md font-semibold mt-4 mb-2">Sample Output</h3>
              <pre className="bg-gray-700 p-4 rounded mb-4">{problem.sampleOutput}</pre>
            </section>
          </div>
        </div>
        <div className="w-1/2 flex flex-col bg-gray-800">
          <div className="p-2 flex justify-between items-center bg-gray-700">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-600 text-white px-2 py-1 rounded"
            >
              <option value="python3">Python3</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[language === 'cpp' ? cpp() : language === 'java' ? java() : python()]}
              onChange={(value) => setCode(value)}
              theme="dark"
            />
          </div>
          <div className="p-2 bg-gray-700">
            <h4 className="text-sm font-semibold mb-1">Custom Input</h4>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full bg-gray-600 p-2 rounded mb-2 text-white text-sm"
              rows="3"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRun}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-500"
              >
                <FaPlay className="inline mr-1" /> Run
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-500"
              >
                <FaPaperPlane className="inline mr-1" /> Submit
              </button>
            </div>
          </div>
        </div>
      </main>
      {error && <div className="p-2 bg-red-500 text-white text-sm">{error}</div>}
      {result && (
        <div className="p-2 bg-green-500 text-white text-sm">
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
};

export default ProblemSolving;
