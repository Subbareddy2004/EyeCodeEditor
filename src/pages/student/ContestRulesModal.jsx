import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ContestRulesModal = ({ contest, onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{contest.name} Rules</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              1. The contest will last for {contest.duration}.
            </p>
            <p className="text-sm text-gray-500">
              2. You will earn points for each correctly solved problem.
            </p>
            <p className="text-sm text-gray-500">
              3. The faster you solve a problem, the more points you earn.
            </p>
            <p className="text-sm text-gray-500">
              4. The total score is calculated based on the number of problems solved and the time taken.
            </p>
            <p className="text-sm text-gray-500">
              5. Plagiarism or any form of cheating will result in disqualification.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Accept & Join Contest
            </button>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ContestRulesModal;
