import React, { useState, useEffect } from 'react';
import { getFacultyProblems } from '../services/problemService';

const ProblemSelector = ({ onSelect, selectedProblems = [] }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getFacultyProblems();
        setProblems(data);
      } catch (err) {
        setError('Failed to load problems');
        console.error('Error loading problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <div>Loading problems...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Problems</h3>
      <div className="max-h-60 overflow-y-auto">
        {problems.map((problem) => (
          <div key={problem._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
            <input
              type="checkbox"
              id={problem._id}
              checked={selectedProblems.includes(problem._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelect([...selectedProblems, problem._id]);
                } else {
                  onSelect(selectedProblems.filter(id => id !== problem._id));
                }
              }}
              className="h-4 w-4 text-indigo-600"
            />
            <label htmlFor={problem._id} className="flex-1 cursor-pointer">
              <div className="font-medium">{problem.title}</div>
              <div className="text-sm text-gray-500">
                Difficulty: {problem.difficulty}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSelector;