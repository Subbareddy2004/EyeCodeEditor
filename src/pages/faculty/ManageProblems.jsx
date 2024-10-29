import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFacultyProblems, deleteProblem } from '../../services/problems';

const ManageProblems = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await getFacultyProblems();
      setProblems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await deleteProblem(id);
        setProblems(problems.filter(p => p._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Problems</h1>
        <Link 
          to="/faculty/problems/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Problem
        </Link>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Difficulty</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {problems.map(problem => (
              <tr key={problem._id}>
                <td className="px-6 py-4">{problem.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Link 
                      to={`/faculty/problems/edit/${problem._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProblems;