import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ProblemSelector from './ProblemSelector';

const ContestForm = ({ isEditing }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date().toISOString().slice(0, 16),
    duration: 120,
    problems: []
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchContest();
    }
  }, [isEditing, id]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(`/contests/${id}`);
      const contest = response.data;
      setFormData({
        ...contest,
        startTime: new Date(contest.startTime).toISOString().slice(0, 16),
        problems: contest.problems.map(p => ({
          problem: p.problem._id,
          points: p.points
        }))
      });
    } catch (error) {
      toast.error('Error fetching contest');
      navigate('/faculty/contests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        problems: formData.problems.map(p => ({
          problem: p.problemId || p.problem._id || p.problem,
          points: Number(p.points) || 100
        }))
      };

      if (isEditing) {
        await axios.put(`/contests/${id}`, payload);
        toast.success('Contest updated successfully');
      } else {
        await axios.post('/contests', payload);
        toast.success('Contest created successfully');
      }
      navigate('/faculty/contests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving contest');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Math.max(1, Number(value) || 0) : value
    }));
  };

  const formFields = [
    {
      id: 'title',
      label: 'Title',
      name: 'title',
      type: 'text',
      value: formData.title
    },
    {
      id: 'description',
      label: 'Description',
      name: 'description',
      type: 'textarea',
      value: formData.description
    },
    {
      id: 'startTime',
      label: 'Start Time',
      name: 'startTime',
      type: 'datetime-local',
      value: formData.startTime
    },
    {
      id: 'duration',
      label: 'Duration (minutes)',
      name: 'duration',
      type: 'number',
      value: formData.duration,
      min: 1
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Contest' : 'Create Contest'}
      </h1>

      <div className="space-y-4">
        {formFields.map(field => (
          <div key={field.id} className="form-group">
            <label className="block mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={field.value || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                required
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={field.value || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min={field.min}
                required
              />
            )}
          </div>
        ))}

        <ProblemSelector
          selectedProblems={formData.problems}
          onChange={(problems) => setFormData(prev => ({ ...prev, problems }))}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update Contest' : 'Create Contest'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/faculty/contests')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContestForm; 