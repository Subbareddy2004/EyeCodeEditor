import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaCode, FaCheck, FaTimes, FaPlay } from 'react-icons/fa';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContestParticipation = () => {
  const { contestId } = useParams();
  const [contestDetails, setContestDetails] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/student/contests/${contestId}/details`,
          { headers: getAuthHeaders() }
        );
        setContestDetails(response.data);
        if (response.data.problems.length > 0) {
          setSelectedProblem(response.data.problems[0]);
        }
      } catch (error) {
        console.error('Error fetching contest details:', error);
        toast.error('Failed to load contest details');
      }
    };

    fetchContestDetails();
  }, [contestId]);

  const handleRunCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/student/contests/${contestId}/problems/${selectedProblem._id}/run`,
        {
          code,
          language
        },
        { headers: getAuthHeaders() }
      );
      toast.success('Code ran successfully!');
      // Handle the response appropriately
    } catch (error) {
      console.error('Error running code:', error);
      toast.error(error.response?.data?.message || 'Failed to run code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/student/contests/${contestId}/problems/${selectedProblem._id}/submit`,
        {
          code,
          language
        },
        { headers: getAuthHeaders() }
      );
      toast.success('Code submitted successfully!');
      // Handle the response appropriately
    } catch (error) {
      console.error('Error submitting code:', error);
      toast.error(error.response?.data?.message || 'Failed to submit code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{contestDetails?.title}</h1>
          <div className="flex items-center space-x-4">
            <FaClock className="text-blue-400" />
            <span>{timeRemaining || 'Time Remaining: calculating...'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex h-[calc(100vh-5rem)]">
        {/* Problems Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Problems</h2>
            <div className="space-y-2">
              {contestDetails?.problems.map((problem, index) => (
                <button
                  key={problem._id}
                  onClick={() => setSelectedProblem(problem)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProblem?._id === problem._id
                      ? 'bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Problem {index + 1}</span>
                    <span className="text-sm font-semibold">{problem.points} pts</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1 truncate">
                    {problem.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Content and Editor */}
        {selectedProblem ? (
          <div className="flex-1 flex flex-col">
            {/* Problem Description */}
            <div className="h-1/2 overflow-y-auto p-6 bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">{selectedProblem.title}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="mb-6">{selectedProblem.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sample Input:</h3>
                    <pre className="bg-gray-900 p-4 rounded-lg">
                      {selectedProblem.sampleInput}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sample Output:</h3>
                    <pre className="bg-gray-900 p-4 rounded-lg">
                      {selectedProblem.sampleOutput}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="h-1/2 flex flex-col">
              <div className="bg-gray-800 p-4 border-t border-b border-gray-700">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="flex-1">
                <CodeMirror
                  value={code}
                  height="100%"
                  theme="dark"
                  extensions={[
                    language === 'cpp' 
                      ? cpp() 
                      : language === 'java' 
                      ? java() 
                      : python()
                  ]}
                  onChange={(value) => setCode(value)}
                />
              </div>
              <div className="bg-gray-800 p-4 border-t border-gray-700">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleRunCode()}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaPlay />
                    <span>Run Code</span>
                  </button>
                  <button
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaCheck />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a problem to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestParticipation;