import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

const ReportForm = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/student/report', formData);
      toast.success('Report submitted successfully');
      setFormData({ subject: '', description: '', priority: 'medium' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting report');
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Report an Issue
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className={`w-full p-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className={`w-full p-3 rounded-lg border h-32 resize-none ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            required
          />
        </div>
        <div>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className={`w-full p-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          >
            <option value="low" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Low Priority</option>
            <option value="medium" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Medium Priority</option>
            <option value="high" className={darkMode ? 'bg-gray-700' : 'bg-white'}>High Priority</option>
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaPaperPlane className="mr-2" />
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm; 