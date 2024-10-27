// client/src/pages/faculty/ContestManagement.jsx
import React, { useState, useEffect } from 'react';
import { createContest, getAllContests, updateContest, deleteContest } from '../../services/contestService';

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [newContest, setNewContest] = useState({ title: '', description: '', startTime: '', duration: '' });

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    const data = await getAllContests();
    setContests(data);
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();
    await createContest(newContest);
    setNewContest({ title: '', description: '', startTime: '', duration: '' });
    fetchContests();
  };

  const handleUpdateContest = async (id, updatedData) => {
    await updateContest(id, updatedData);
    fetchContests();
  };

  const handleDeleteContest = async (id) => {
    await deleteContest(id);
    fetchContests();
  };

  return (
    <div>
      <h1>Contest Management</h1>
      <form onSubmit={handleCreateContest}>
        <input
          type="text"
          value={newContest.title}
          onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
          placeholder="Contest Title"
        />
        <textarea
          value={newContest.description}
          onChange={(e) => setNewContest({ ...newContest, description: e.target.value })}
          placeholder="Contest Description"
        />
        <input
          type="datetime-local"
          value={newContest.startTime}
          onChange={(e) => setNewContest({ ...newContest, startTime: e.target.value })}
        />
        <input
          type="text"
          value={newContest.duration}
          onChange={(e) => setNewContest({ ...newContest, duration: e.target.value })}
          placeholder="Duration (e.g., 2 hours)"
        />
        <button type="submit">Create Contest</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Time</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest._id}>
              <td>{contest.title}</td>
              <td>{contest.description}</td>
              <td>{new Date(contest.startTime).toLocaleString()}</td>
              <td>{contest.duration}</td>
              <td>
                <button onClick={() => handleUpdateContest(contest._id, { /* updated data */ })}>Edit</button>
                <button onClick={() => handleDeleteContest(contest._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestManagement;
