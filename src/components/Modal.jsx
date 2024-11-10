import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className={`inline-block w-full align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg sm:text-xl font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className={`rounded-md p-2 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mt-2 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;