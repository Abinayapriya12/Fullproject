import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AllSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch all submissions – if you have a dedicated endpoint like /submissions/all
    // Otherwise fetch assignments and their submissions.
    // For simplicity, we assume an endpoint /api/submissions/all exists.
    axios.get('http://localhost:5000/api/submissions/all')
      .then(res => setSubmissions(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleGrade = async () => {
    await axios.put(`http://localhost:5000/api/submissions/${selectedSub._id}/grade`, { grade, feedback });
    setSelectedSub(null);
    setGrade('');
    setFeedback('');
    // Refresh list
    const { data } = await axios.get('http://localhost:5000/api/submissions/all');
    setSubmissions(data);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-7">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        ← Back
      </button>
      <div className="max-w-5xl mx-auto pt-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">All Submissions</h1>
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center text-gray-500">
            No submissions yet.
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map(sub => (
              <div key={sub._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{sub.student.name} ({sub.student.email})</p>
                    <p className="text-sm text-indigo-600">Assignment: {sub.assignment.title}</p>
                    <p className="text-sm text-gray-500">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                    {sub.grade !== undefined && (
                      <p className="mt-2 text-green-600 font-medium">Grade: {sub.grade} | Feedback: {sub.feedback}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={sub.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        setGrade(sub.grade || '');
                        setFeedback(sub.feedback || '');
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm"
                    >
                      Grade
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Grade Submission</h2>
            <p className="text-gray-700 mb-4">Student: {selectedSub.student.name}</p>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Grade (0-100)"
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Feedback"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGrade}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllSubmissions;