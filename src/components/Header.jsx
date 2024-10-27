import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">EyeLabs</Link>
          <nav className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Register</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
