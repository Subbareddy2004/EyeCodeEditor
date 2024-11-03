import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    class: '',
    dueDate: '',
    problems: [{
      title: '',
      description: '',
      language: 'py',
      points: 0,
      testCases: [{
        input: '',
        expectedOutput: '',
        isHidden: true
      }]
    }]
  });

  const addProblem = () => {
    setAssignment({
      ...assignment,
      problems: [...assignment.problems, {
        title: '',
        description: '',
        language: 'py',
        points: 0,
        testCases: [{
          input: '',
          expectedOutput: '',
          isHidden: true
        }]
      }]
    });
  };

  const addTestCase = (problemIndex) => {
    const updatedProblems = [...assignment.problems];
    updatedProblems[problemIndex].testCases.push({
      input: '',
      expectedOutput: '',
      isHidden: true
    });
    setAssignment({ ...assignment, problems: updatedProblems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/assignments`, assignment);
      toast.success('Assignment created successfully!');
      navigate('/faculty/assignments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c] text-white' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Assignment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Details */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Assignment Title"
              value={assignment.title}
              onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
              className={`w-full p-2 rounded ${darkMode ? 'bg-[#242b3d] border-[#2d3548]' : 'bg-white border-gray-300'}`}
              required
            />
            
            <textarea
              placeholder="Assignment Description"
              value={assignment.description}
              onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
              className={`w-full p-2 rounded ${darkMode ? 'bg-[#242b3d] border-[#2d3548]' : 'bg-white border-gray-300'}`}
              rows="4"
            />

            <input
              type="text"
              placeholder="Class (e.g., CSE-A)"
              value={assignment.class}
              onChange={(e) => setAssignment({ ...assignment, class: e.target.value })}
              className={`w-full p-2 rounded ${darkMode ? 'bg-[#242b3d] border-[#2d3548]' : 'bg-white border-gray-300'}`}
              required
            />

            <input
              type="datetime-local"
              value={assignment.dueDate}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
              className={`w-full p-2 rounded ${darkMode ? 'bg-[#242b3d] border-[#2d3548]' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          {/* Problems */}
          <div className="space-y-8">
            {assignment.problems.map((problem, problemIndex) => (
              <div key={problemIndex} className={`p-4 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Problem {problemIndex + 1}</h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Problem Title"
                    value={problem.title}
                    onChange={(e) => {
                      const updatedProblems = [...assignment.problems];
                      updatedProblems[problemIndex].title = e.target.value;
                      setAssignment({ ...assignment, problems: updatedProblems });
                    }}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-[#1a1f2c] border-[#2d3548]' : 'bg-gray-50 border-gray-300'}`}
                    required
                  />

                  <textarea
                    placeholder="Problem Description"
                    value={problem.description}
                    onChange={(e) => {
                      const updatedProblems = [...assignment.problems];
                      updatedProblems[problemIndex].description = e.target.value;
                      setAssignment({ ...assignment, problems: updatedProblems });
                    }}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-[#1a1f2c] border-[#2d3548]' : 'bg-gray-50 border-gray-300'}`}
                    rows="4"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={problem.language}
                      onChange={(e) => {
                        const updatedProblems = [...assignment.problems];
                        updatedProblems[problemIndex].language = e.target.value;
                        setAssignment({ ...assignment, problems: updatedProblems });
                      }}
                      className={`p-2 rounded ${darkMode ? 'bg-[#1a1f2c] border-[#2d3548]' : 'bg-gray-50 border-gray-300'}`}
                    >
                      <option value="py">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="js">JavaScript</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Points"
                      value={problem.points}
                      onChange={(e) => {
                        const updatedProblems = [...assignment.problems];
                        updatedProblems[problemIndex].points = parseInt(e.target.value);
                        setAssignment({ ...assignment, problems: updatedProblems });
                      }}
                      className={`p-2 rounded ${darkMode ? 'bg-[#1a1f2c] border-[#2d3548]' : 'bg-gray-50 border-gray-300'}`}
                      min="0"
                      required
                    />
                  </div>

                  {/* Test Cases */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Test Cases</h4>
                    {problem.testCases.map((testCase, testIndex) => (
                      <div key={testIndex} className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Input"
                          value={testCase.input}
                          onChange={(e) => {
                            const updatedProblems = [...assignment.problems];
                            updatedProblems[problemIndex].testCases[testIndex].input = e.target.value;
                            setAssignment({ ...assignment, problems: updatedProblems });
                          }}
                          className={`p-2 rounded ${darkMode ? 'bg-[#1a1f2c] border-[#2d3548]' : 'bg-gray-50 border-gray-300'}`}
                        />
                        <input
                          type="text"
                          placeholder="Expected Output"
                          value={testCase.expectedOutput}
                          onChange={(e) => {
                            const updatedProblems = [...assignment.problems];
                            updatedProblems[problemIndex].testCases[testIndex].expectedOutput = e.target.value;
                            setAssignment({ ...assignment, problems: updatedProblems });
                          }}
                          className={`p-2 rounded ${darkMode ? 'bg-[#1a1f2c] border-[#2d3548]' : 'bg-gray-50 border-gray-300'}`}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTestCase(problemIndex)}
                      className={`flex items-center px-4 py-2 rounded ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      <FaPlus className="mr-2" /> Add Test Case
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addProblem}
              className={`flex items-center px-4 py-2 rounded ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <FaPlus className="mr-2" /> Add Problem
            </button>

            <button
              type="submit"
              className={`px-6 py-2 rounded font-semibold ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment; 