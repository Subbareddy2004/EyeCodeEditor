import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await axios.get(`${API_URL}/assignments`);
      setAssignments(response.data);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-6 rounded-lg ${darkMode ? 'bg-[#242b3d]' : 'bg-white'} animate-pulse`}>
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1a1f2c]' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Assignments
        </h1>

        <div className="space-y-4">
          {assignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = dueDate < new Date();
            const progress = {
              completed: assignment.problemsSolved || 0,
              total: assignment.totalProblems || 0
            };
            const isCompleted = progress.completed === progress.total;

            return (
              <div
                key={assignment._id}
                onClick={() => navigate(`/student/assignments/${assignment._id}`)}
                className={`p-6 rounded-lg cursor-pointer transition-all duration-200 ${
                  darkMode 
                    ? 'bg-[#242b3d] hover:bg-[#2d3548]' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {assignment.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isOverdue
                      ? 'bg-red-100 text-red-800'
                      : isCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isOverdue ? 'Overdue' : isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <FaCode className="mr-2" />
                    {progress.completed} / {progress.total} Problems Solved
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString()}
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className={`h-2.5 rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
