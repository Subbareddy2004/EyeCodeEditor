import React from 'react';
import { Link } from 'react-router-dom';

const FacultyHeader = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/faculty/dashboard" className="text-2xl font-bold">EyeLabs Faculty</Link>
          <nav className="space-x-6">
            <Link to="/faculty/problems" className="hover:text-green-200 transition">Manage Problems</Link>
            <Link to="/faculty/contests" className="hover:text-green-200 transition">Manage Contests</Link>
            <Link to="/faculty/students" className="hover:text-green-200 transition">Students</Link>
            <div className="inline-block relative group">
              <button className="hover:text-green-200 transition">{user.name} ▼</button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/faculty/profile" className="block px-4 py-2 text-gray-800 hover:bg-teal-500 hover:text-white">Profile</Link>
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-teal-500 hover:text-white">Logout</button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default FacultyHeader;
