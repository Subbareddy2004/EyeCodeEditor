import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 60,
    problems: []
  });
  const [availableProblems, setAvailableProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
    if (id) {
      fetchContest();
    }
  }, [id]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/problems');
      setAvailableProblems(response.data);
    } catch (error) {
      toast.error('Error fetching problems');
    }
  };

  const fetchContest = async () => {
    try {
      const response = await axios.get(`/contests/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        startTime: new Date(response.data.startTime).toISOString().slice(0, 16),
        duration: response.data.duration,
        problems: response.data.problems
      });
    } catch (error) {
      toast.error('Error fetching contest');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/contests/${id}`, formData);
        toast.success('Contest updated successfully');
      } else {
        await axios.post('/contests', formData);
        toast.success('Contest created successfully');
      }
      navigate('/faculty/contests');
    } catch (error) {
      toast.error('Error saving contest');
    }
  };

  const handleProblemAdd = (problemId) => {
    setFormData(prev => ({
      ...prev,
      problems: [...prev.problems, { problemId, points: 100 }]
    }));
  };

  const handleProblemRemove = (problemId) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.filter(p => p.problemId !== problemId)
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Contest' : 'Create Contest'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              title: e.target.value
            }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: e.target.value
            }))}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Start Time</label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              startTime: e.target.value
            }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              duration: parseInt(e.target.value)
            }))}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Problems</label>
          <div className="space-y-4">
            {formData.problems.map(problem => (
              <div key={problem.problemId} className="flex items-center space-x-4">
                <span>{availableProblems.find(p => p._id === problem.problemId)?.title}</span>
                <input
                  type="number"
                  value={problem.points}
                  onChange={(e) => {
                    const newProblems = formData.problems.map(p =>
                      p.problemId === problem.problemId
                        ? { ...p, points: parseInt(e.target.value) }
                        : p
                    );
                    setFormData(prev => ({ ...prev, problems: newProblems }));
                  }}
                  className="w-24 p-2 border rounded"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => handleProblemRemove(problem.problemId)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <select
            onChange={(e) => handleProblemAdd(e.target.value)}
            className="mt-4 w-full p-2 border rounded"
            value=""
          >
            <option value="">Add a problem...</option>
            {availableProblems
              .filter(p => !formData.problems.find(fp => fp.problemId === p._id))
              .map(problem => (
                <option key={problem._id} value={problem._id}>
                  {problem.title}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/faculty/contests')}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {id ? 'Update Contest' : 'Create Contest'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContestForm;