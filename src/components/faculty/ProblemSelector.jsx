import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProblemSelector = ({ selectedProblems, onChange }) => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/problems');
      setProblems(response.data);
    } catch (error) {
      toast.error('Error fetching problems');
    }
  };

  const handleAddProblem = () => {
    if (!problems.length) return;
    
    const newProblem = {
      problemId: problems[0]._id,
      points: 100
    };
    
    onChange([...selectedProblems, newProblem]);
  };

  const handleProblemChange = (index, field, value) => {
    const updatedProblems = selectedProblems.map((p, i) => {
      if (i === index) {
        return {
          ...p,
          [field]: field === 'points' ? Number(value) || 0 : value
        };
      }
      return p;
    });
    onChange(updatedProblems);
  };

  const handleRemoveProblem = (index) => {
    onChange(selectedProblems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Problems</h3>
      <div className="space-y-2">
        {selectedProblems.map((problem, index) => (
          <div key={`problem-${index}`} className="flex gap-2 items-center">
            <select
              value={problem.problemId || problem.problem || ''}
              onChange={(e) => handleProblemChange(index, 'problemId', e.target.value)}
              className="flex-grow p-2 border rounded"
            >
              {problems.map(p => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={String(problem.points || 100)}
              onChange={(e) => handleProblemChange(index, 'points', e.target.value)}
              className="w-24 p-2 border rounded"
              min="0"
              placeholder="Points"
            />
            <button
              type="button"
              onClick={() => handleRemoveProblem(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddProblem}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={!problems.length}
      >
        Add Problem
      </button>
    </div>
  );
};

export default ProblemSelector; 