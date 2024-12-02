import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPlus, FaTimes } from 'react-icons/fa';

const ProblemSelector = ({ selectedProblems = [], onChange }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/api/admin/problems');
      setProblems(response.data);
    } catch (error) {
      toast.error('Error fetching problems');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSelect = (problem) => {
    if (!selectedProblems.find(p => p._id === problem._id)) {
      onChange([...selectedProblems, problem]);
    }
  };

  const handleProblemRemove = (problemId) => {
    onChange(selectedProblems.filter(p => p._id !== problemId));
  };

  return (
    <div className="mb-4">
      <label className="block mb-2">Problems</label>
      
      {/* Selected Problems */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Selected Problems:</h4>
        <div className="space-y-2">
          {selectedProblems.map(problem => (
            <div 
              key={problem._id}
              className={`flex justify-between items-center p-2 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <span>{problem.title}</span>
              <button
                type="button"
                onClick={() => handleProblemRemove(problem._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Available Problems */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Available Problems:</h4>
        <div className="space-y-2">
          {problems
            .filter(p => !selectedProblems.find(sp => sp._id === p._id))
            .map(problem => (
              <div 
                key={problem._id}
                className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
                onClick={() => handleProblemSelect(problem)}
              >
                <span>{problem.title}</span>
                <FaPlus className="text-green-500" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemSelector; 