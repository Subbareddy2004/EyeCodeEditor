// client/src/pages/faculty/ContestManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaUsers, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';
import { getContests, createContest, updateContest, deleteContest } from '../../services/contestService';
import { getFacultyProblems } from '../../services/problemService';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [availableProblems, setAvailableProblems] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: '',
    problems: []
  });

  useEffect(() => {
    loadContests();
    loadProblems();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      const data = await getContests();
      console.log('Loaded contests:', data);
      setContests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load contests:', err);
      setError(err.message || 'Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const loadProblems = async () => {
    try {
      const problems = await getFacultyProblems();
      setAvailableProblems(problems || []);
    } catch (err) {
      console.error('Failed to load problems:', err);
      setError('Failed to load problems');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contestData = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        duration: parseInt(formData.duration),
        problems: formData.problems.map(p => ({
          problem: p.problemId,
          points: parseInt(p.points)
        }))
      };

      console.log('Submitting contest data:', contestData);

      if (formData._id) {
        await updateContest(formData._id, contestData);
      } else {
        await createContest(contestData);
      }

      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        duration: '',
        problems: []
      });
      loadContests();
    } catch (err) {
      console.error('Failed to save contest:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleProblemSelection = (problemId, defaultPoints) => {
    setFormData(prev => {
      const existingProblem = prev.problems.find(p => p.problemId === problemId);
      let updatedProblems;

      if (existingProblem) {
        updatedProblems = prev.problems.filter(p => p.problemId !== problemId);
      } else {
        updatedProblems = [...prev.problems, { 
          problemId, 
          points: defaultPoints || 100
        }];
      }
      
      console.log('Updated problems:', updatedProblems);
      return { ...prev, problems: updatedProblems };
    });
  };

  const handlePointsChange = (problemId, points) => {
    setFormData(prev => {
      const updatedProblems = prev.problems.map(p => 
        p.problemId === problemId ? { ...p, points: Number(points) } : p
      );
      return { ...prev, problems: updatedProblems };
    });
  };

  const viewLeaderboard = (contestId) => {
    navigate(`/faculty/contests/${contestId}/leaderboard`);
  };

  const handleEdit = (contest) => {
    if (!contest) return;

    setFormData({
      _id: contest._id,
      title: contest.title || '',
      description: contest.description || '',
      startTime: contest.startTime ? new Date(contest.startTime).toISOString().slice(0, 16) : '',
      duration: contest.duration || '',
      problems: (contest.problems || []).map(p => ({
        problemId: p.problem?._id || p._id,
        points: p.points || 0
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await deleteContest(contestId);
        loadContests(); // Reload the contests after deletion
      } catch (err) {
        console.error('Failed to delete contest:', err);
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contest Management</h1>
        <button
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              startTime: '',
              duration: '',
              problems: []
            });
            setShowForm(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Create Contest
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contests.map((contest) => (
            <div key={contest._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{contest.title || 'Untitled Contest'}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📅</span>
                  {new Date(contest.startTime).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">⏱️</span>
                  {contest.duration} minutes
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">👥</span>
                  {contest.submissions?.length || 0} Participants
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Problems:</h3>
                <div className="space-y-2">
                  {contest.problems?.map((problemData) => (
                    <div key={problemData.problem?._id || problemData._id} className="flex items-center">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {problemData.problem?.title || 'Untitled Problem'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({problemData.points || 0} pts)
                      </span>
                    </div>
                  )) || 'No problems added'}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/faculty/contests/${contest._id}/leaderboard`)}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => handleEdit(contest)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contest._id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contest Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? 'Edit Contest' : 'Create Contest'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problems
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {availableProblems.map((problem) => (
                      <div key={problem._id} className="flex items-center space-x-3 py-2">
                        <input
                          type="checkbox"
                          id={`problem-${problem._id}`}
                          checked={formData.problems.some(p => p.problemId === problem._id)}
                          onChange={() => handleProblemSelection(problem._id, problem.defaultPoints)}
                          className="h-4 w-4 text-green-600 rounded border-gray-300"
                        />
                        <label 
                          htmlFor={`problem-${problem._id}`}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 flex-grow"
                        >
                          {problem.title} - {problem.difficulty}
                        </label>
                        {formData.problems.some(p => p.problemId === problem._id) && (
                          <input
                            type="number"
                            value={formData.problems.find(p => p.problemId === problem._id)?.points || ''}
                            onChange={(e) => handlePointsChange(problem._id, e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded"
                            placeholder="Points"
                            min="0"
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    {formData._id ? 'Update' : 'Create'} Contest
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestManagement;
