import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTrophy, FaChartLine, FaUserCircle, FaCog, FaClipboardList, FaHome } from 'react-icons/fa';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/student/dashboard" className="text-2xl font-bold flex items-center">
            <FaCode className="mr-2 text-yellow-400" /> EyeLabs
          </Link>
          <nav className="flex items-center space-x-6">
            <NavLink to="/student/dashboard" icon={<FaHome />} text="Home" />
            <NavLink to="/student/problems" icon={<FaCode />} text="Problems" />
            <NavLink to="/student/assignments" icon={<FaClipboardList />} text="Assignments" />
            <NavLink to="/student/contests" icon={<FaTrophy />} text="Contests" />
            <NavLink to="/student/leaderboard" icon={<FaChartLine />} text="Leaderboard" />
            <div className="relative group">
              <button className="flex items-center space-x-1 focus:outline-none bg-indigo-700 rounded-full px-3 py-1 hover:bg-indigo-600 transition duration-150">
                <FaUserCircle className="text-xl text-yellow-400" />
                <span>{user.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/student/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                  <FaUserCircle className="inline mr-2" /> Profile
                </Link>
                <Link to="/student/settings" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                  <FaCog className="inline mr-2" /> Settings
                </Link>
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center space-x-1 hover:text-yellow-400 transition duration-150 ease-in-out">
    {icon}
    <span>{text}</span>
  </Link>
);

export default Header;
