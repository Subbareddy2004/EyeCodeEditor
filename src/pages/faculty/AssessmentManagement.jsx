// client/src/pages/faculty/AssessmentManagement.jsx
import React, { useState, useEffect } from 'react';
import { createAssessment, getAllAssessments, updateAssessment, deleteAssessment, assignAssessment } from '../../services/assessmentService';

const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [newAssessment, setNewAssessment] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    const data = await getAllAssessments();
    setAssessments(data);
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    await createAssessment(newAssessment);
    setNewAssessment({ title: '', description: '' });
    fetchAssessments();
  };

  const handleUpdateAssessment = async (id, updatedData) => {
    await updateAssessment(id, updatedData);
    fetchAssessments();
  };

  const handleDeleteAssessment = async (id) => {
    await deleteAssessment(id);
    fetchAssessments();
  };

  const handleAssignAssessment = async (id, studentIds) => {
    await assignAssessment(id, studentIds);
    // Show success message
  };

  return (
    <div>
      <h1>Assessment Management</h1>
      <form onSubmit={handleCreateAssessment}>
        <input
          type="text"
          value={newAssessment.title}
          onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
          placeholder="Assessment Title"
        />
        <textarea
          value={newAssessment.description}
          onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
          placeholder="Assessment Description"
        />
        <button type="submit">Create Assessment</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr key={assessment._id}>
              <td>{assessment.title}</td>
              <td>{assessment.description}</td>
              <td>
                <button onClick={() => handleUpdateAssessment(assessment._id, { /* updated data */ })}>Edit</button>
                <button onClick={() => handleDeleteAssessment(assessment._id)}>Delete</button>
                <button onClick={() => handleAssignAssessment(assessment._id, [/* student ids */])}>Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentManagement;