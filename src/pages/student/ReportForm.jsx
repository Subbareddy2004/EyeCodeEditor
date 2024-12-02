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
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Report an Issue
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full p-2 rounded border"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 rounded border h-32"
            required
          />
        </div>
        <div className="mb-4">
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full p-2 rounded border"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPaperPlane className="mr-2" />
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm; 