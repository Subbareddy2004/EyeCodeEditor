import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContest, updateContest } from '../../services/contestService';
import { getFacultyProblems } from '../../services/problemService';
import { toast } from 'react-toastify';

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: '',
    problems: []
  });
  const [availableProblems, setAvailableProblems] = useState([]);
  const [problemPoints, setProblemPoints] = useState({});

  useEffect(() => {
    loadContest();
    loadProblems();
  }, [id]);

  const loadContest = async () => {
    try {
      const contest = await getContest(id);
      setFormData({
        title: contest.title,
        description: contest.description,
        startTime: new Date(contest.startTime).toISOString().slice(0, 16),
        duration: contest.duration,
        problems: contest.problems.map(p => p.problem._id)
      });
      const points = {};
      contest.problems.forEach(p => {
        points[p.problem._id] = p.points;
      });
      setProblemPoints(points);
    } catch (error) {
      toast.error('Failed to load contest');
    }
  };

  const loadProblems = async () => {
    try {
      const problems = await getFacultyProblems();
      setAvailableProblems(problems);
    } catch (error) {
      toast.error('Failed to load problems');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProblemSelection = (problemId) => {
    setFormData(prev => {
      const problems = prev.problems.includes(problemId)
        ? prev.problems.filter(id => id !== problemId)
        : [...prev.problems, problemId];
      
      if (!prev.problems.includes(problemId) && !problemPoints[problemId]) {
        setProblemPoints(prevPoints => ({
          ...prevPoints,
          [problemId]: 100
        }));
      }
      
      return { ...prev, problems };
    });
  };

  const handlePointsChange = (problemId, points) => {
    setProblemPoints(prev => ({
      ...prev,
      [problemId]: parseInt(points) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contestData = {
        ...formData,
        problems: formData.problems.map(problemId => ({
          problem: problemId,
          points: problemPoints[problemId] || 0
        }))
      };
      await updateContest(id, contestData);
      toast.success('Contest updated successfully');
      navigate('/faculty/contests');
    } catch (error) {
      toast.error('Failed to update contest');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Edit Contest</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic contest details */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
          </div>

          {/* Problems section with points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Problems</label>
            <div className="border border-gray-300 rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
              {availableProblems.map(problem => (
                <div 
                  key={problem._id}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    formData.problems.includes(problem._id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'border border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.problems.includes(problem._id)}
                      onChange={() => handleProblemSelection(problem._id)}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{problem.title}</h3>
                      <p className="text-sm text-gray-500">Difficulty: {problem.difficulty}</p>
                    </div>
                  </div>
                  {formData.problems.includes(problem._id) && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Points:</label>
                      <input
                        type="number"
                        value={problemPoints[problem._id] || 0}
                        onChange={(e) => handlePointsChange(problem._id, e.target.value)}
                        className="w-20 p-1 border border-gray-300 rounded-md"
                        min="0"
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {formData.problems.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Please select at least one problem</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/faculty/contests')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            disabled={formData.problems.length === 0}
          >
            Update Contest
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContest;