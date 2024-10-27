import React, { useState } from 'react';
import { createProblem } from '../../services/problems';

const ProblemCreation = () => {
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    sampleInput: '',
    sampleOutput: '',
    testCases: []
  });

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProblem(problem);
      alert('Problem created successfully!');
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating problem:', error);
      alert('Failed to create problem. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Problem</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={problem.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={problem.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="difficulty" className="block mb-2">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={problem.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="sampleInput" className="block mb-2">Sample Input</label>
          <textarea
            id="sampleInput"
            name="sampleInput"
            value={problem.sampleInput}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="2"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="sampleOutput" className="block mb-2">Sample Output</label>
          <textarea
            id="sampleOutput"
            name="sampleOutput"
            value={problem.sampleOutput}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="2"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Create Problem
        </button>
      </form>
    </div>
  );
};

export default ProblemCreation;

