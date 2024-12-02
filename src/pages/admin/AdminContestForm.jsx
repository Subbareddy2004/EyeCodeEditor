import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import ProblemSelector from '../../components/admin/ProblemSelector';

const AdminContestForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    problems: []
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (id) {
      fetchContest();
    }
  }, [id]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(`/admin/contests/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Error fetching contest details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/admin/contests/${id}`, formData);
        toast.success('Contest updated successfully');
      } else {
        await axios.post('/admin/contests', formData);
        toast.success('Contest created successfully');
      }
      navigate('/admin/contests');
    } catch (error) {
      toast.error('Error saving contest');
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Contest' : 'Create Contest'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <ProblemSelector
          selectedProblems={formData.problems}
          onChange={(problems) => setFormData({ ...formData, problems })}
        />
        <button type="submit" className="mt-4 p-2 bg-blue-600 text-white rounded">
          {id ? 'Update Contest' : 'Create Contest'}
        </button>
      </form>
    </div>
  );
};

export default AdminContestForm; 