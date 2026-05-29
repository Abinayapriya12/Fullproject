import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AssignmentList() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    fetchAssignments();
    fetchMySubmissions();
  }, []);

  const fetchAssignments = async () => {

    const { data } = await axios.get('http://localhost:5000/api/assignments');
    setAssignments(data);
  };

  const fetchMySubmissions = async () => {

    const { data } = await axios.get('http://localhost:5000/api/submissions');
    setSubmissions(data);
  };

  const alreadySubmitted = (assignmentId) =>
    submissions.some(sub => sub.assignment._id === assignmentId);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-7">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
      >
        ← Back
      </button>
      <div className="max-w-6xl mx-auto pt-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">📚 Assignments</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <div key={assignment._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>
                <p className="text-sm text-red-500 mb-4">
                  Due: {new Date(assignment.deadline).toLocaleString()}
                </p>
                <button
                  onClick={() => navigate(`/submitassignments/${assignment._id}`)}
                  disabled={alreadySubmitted(assignment._id) || new Date(assignment.deadline) < new Date()}
                  className={`w-full py-2 rounded-md font-medium transition-colors ${alreadySubmitted(assignment._id) || new Date(assignment.deadline) < new Date()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  {alreadySubmitted(assignment._id)
                    ? 'Already Submitted'
                    : new Date(assignment.deadline) < new Date()
                      ? 'Deadline Passed'
                      : 'Submit Assignment'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignmentList;