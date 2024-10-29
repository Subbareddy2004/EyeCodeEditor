import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssignmentSubmissions } from '../../services/assignmentService';
import { getStudents } from '../../services/studentService';

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [submissionData, studentsData] = await Promise.all([
        getAssignmentSubmissions(id),
        getStudents()
      ]);
      
      setAssignment(submissionData.assignment);
      
      // Create a map of existing submissions
      const submissionMap = new Map(
        submissionData.submissions.map(sub => [sub.student._id, sub])
      );

      // Combine all students with their submission status
      const allStudentsWithStatus = studentsData.map(student => ({
        _id: student._id,
        name: student.name,
        email: student.email,
        status: submissionMap.has(student._id) ? 'Completed' : 'Pending',
        submittedAt: submissionMap.get(student._id)?.submittedAt || null
      }));

      setStudents(allStudentsWithStatus);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link 
        to="/faculty/assignments" 
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Assignments
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">{assignment?.title} - Submissions</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="min-w-full">
          <div className="bg-blue-600 text-white">
            <div className="grid grid-cols-4 p-3">
              <div className="font-semibold">STUDENT</div>
              <div className="font-semibold">STATUS</div>
              <div className="font-semibold">SUBMITTED AT</div>
              <div className="font-semibold">ACTIONS</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {students.map((student) => (
              <div key={student._id} className="grid grid-cols-4 p-4 hover:bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.email}</div>
                </div>
                <div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${student.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {student.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {student.submittedAt 
                    ? new Date(student.submittedAt).toLocaleString()
                    : 'Not submitted'}
                </div>
                <div>
                  {student.status === 'Completed' && (
                    <button 
                      className="text-blue-600 hover:text-blue-900 text-sm"
                      onClick={() => window.open(`/problems/${student._id}`, '_blank')}
                    >
                      View Solution
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;