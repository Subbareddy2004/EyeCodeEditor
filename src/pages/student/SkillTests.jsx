import React from 'react';
import { FaCode, FaTrophy, FaClock } from 'react-icons/fa';

const SkillTests = () => {
  const skillTests = [
    { id: 1, title: 'Python Basics', duration: '60 min', questions: 30 },
    { id: 2, title: 'Data Structures', duration: '90 min', questions: 40 },
    { id: 3, title: 'Algorithms', duration: '120 min', questions: 50 },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900">Skill Tests</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillTests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <FaCode className="text-3xl text-indigo-600" />
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {test.questions} questions
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{test.title}</h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <FaClock className="mr-2 text-indigo-500" /> {test.duration}
              </p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
                <FaTrophy className="mr-2" /> Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTests;