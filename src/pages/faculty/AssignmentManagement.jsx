import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFacultyProblems } from '../../services/problemService';
import { createAssignment, getAssignments, updateAssignment, deleteAssignment, getAssignmentSubmissions } from '../../services/assignmentService';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [availableProblems, setAvailableProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    problems: []
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
    loadProblems();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const loadProblems = async () => {
    try {
      const problems = await getFacultyProblems();
      setAvailableProblems(problems);
    } catch (err) {
      console.error('Failed to load problems:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await updateAssignment(formData._id, formData);
      } else {
        await createAssignment(formData);
      }
      loadAssignments();
      setShowForm(false);
    } catch (err) {
      console.error('Failed to submit assignment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        loadAssignments();
      } catch (err) {
        console.error('Failed to delete assignment:', err);
      }
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      _id: assignment._id,
      title: assignment.title,
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
      problems: assignment.problems.map(p => p._id)
    });
    setShowForm(true);
  };

  const viewSubmissions = async (assignment) => {
    try {
      setSelectedAssignment(assignment);
      const submissionData = await getAssignmentSubmissions(assignment._id);
      setSubmissions(submissionData);
      setShowSubmissions(true);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const handleProblemSelection = (problemId) => {
    setFormData(prev => {
      const problems = prev.problems.includes(problemId)
        ? prev.problems.filter(id => id !== problemId)
        : [...prev.problems, problemId];
      return { ...prev, problems };
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
        <button
          onClick={() => {
            setFormData({ title: '', dueDate: '', problems: [] });
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Assignment
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? 'Edit Assignment' : 'Create Assignment'}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
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
                          checked={formData.problems.includes(problem._id)}
                          onChange={() => handleProblemSelection(problem._id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <label 
                          htmlFor={`problem-${problem._id}`}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                        >
                          {problem.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.problems.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">Please select at least one problem</p>
                  )}
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
                    disabled={formData.problems.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formData._id ? 'Update' : 'Create'} Assignment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="min-w-full">
          <div className="bg-blue-600 text-white uppercase text-sm leading-normal">
            <div className="grid grid-cols-5 p-3">
              <div>Title</div>
              <div>Due Date</div>
              <div>Status</div>
              <div>Problems</div>
              <div>Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="grid grid-cols-5 p-4 hover:bg-gray-50">
                <div>{assignment.title}</div>
                <div>{new Date(assignment.dueDate).toLocaleDateString()}</div>
                <div>
                  <button
                    onClick={() => viewSubmissions(assignment)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    View Submissions
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignment.problems.map(problem => (
                    <span key={problem._id} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {problem.title}
                    </span>
                  ))}
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(assignment)} className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(assignment._id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSubmissions && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedAssignment.title} - Submissions</h2>
              <button 
                onClick={() => setShowSubmissions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${submission.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.submittedAt 
                          ? new Date(submission.submittedAt).toLocaleString()
                          : 'Not submitted'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {submission.status === 'Completed' && (
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => {/* Handle viewing submission */}}
                          >
                            View Solution
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;