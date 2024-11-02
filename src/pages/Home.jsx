import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Code Education Platform</h1>
      <p className="text-xl mb-8">This is the home page of your coding education platform.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">For Students</h2>
          <p className="mb-4">Practice coding, participate in contests, and improve your skills.</p>
          <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Join as Student</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">For Faculty</h2>
          <p className="mb-4">Create problems, manage contests, and guide students in their learning journey.</p>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Join as Faculty</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
