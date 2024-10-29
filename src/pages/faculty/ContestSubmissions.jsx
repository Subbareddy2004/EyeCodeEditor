import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContestSubmissions } from '../../services/contestService';
import { FaClock, FaCode } from 'react-icons/fa';

const ContestSubmissions = () => {
  const { contestId, studentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, [contestId, studentId]);

  const loadSubmissions = async () => {
    try {
      const data = await getContestSubmissions(contestId, studentId);
      setSubmissions(data.submissions);
      setStudent(data.student);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <Link 
        to={`/faculty/contests/${contestId}/leaderboard`} 
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Leaderboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Submissions for {student?.name}
        </h1>
        <p className="text-gray-600">
          Registration Number: {student?.regNumber}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {submissions.map((submission) => (
          <div 
            key={submission._id} 
            className="border-b border-gray-200 last:border-0"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">
                  {submission.problem.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-sm font-medium
                  ${submission.status === 'Accepted' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'}`}
                >
                  {submission.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </div>
                <div className="flex items-center">
                  <FaCode className="mr-2" />
                  Language: {submission.language}
                </div>
              </div>

              {submission.status === 'Accepted' && (
                <div className="mt-2 text-sm text-gray-600">
                  Points: {submission.points} | 
                  Time: {submission.executionTime}ms | 
                  Memory: {submission.memoryUsed}KB
                </div>
              )}

              <div className="mt-4">
                <h4 className="font-medium mb-2">Code Submission:</h4>
                <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto">
                  <code>{submission.code}</code>
                </pre>
              </div>

              {submission.status !== 'Accepted' && (
                <div className="mt-4 text-red-600">
                  <h4 className="font-medium mb-2">Error Message:</h4>
                  <pre className="bg-red-50 p-3 rounded-md">
                    {submission.errorMessage}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestSubmissions;