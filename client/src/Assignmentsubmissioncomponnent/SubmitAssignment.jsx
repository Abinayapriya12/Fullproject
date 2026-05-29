import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SubmitAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate MongoDB ObjectId format (24 hex chars)
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    if (!id || !isValidObjectId(id)) {
      setError('Invalid assignment ID. Redirecting...');
      setTimeout(() => navigate('/assignmentlist'), 2000);
      return;
    }
    axios.get(`http://localhost:5000/api/assignments/${id}`)
      .then(res => setAssignment(res.data))
      .catch(err => {
        console.error('Error fetching assignment:', err);
        setError('Assignment not found or server error');
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please login again.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('assignmentId', id);
    formData.append('submission', file);
    try {
      await axios.post('http://localhost:5000/api/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/mysubmissions');
    } catch (err) {
      console.log('Full error object:', err);
      console.log('Response data:', err.response?.data);
      console.log('Status code:', err.response?.status);
      const errorMsg = err.response?.data?.message || 'Submission failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (error && !assignment) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={() => navigate('/assignmentlist')} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">Loading assignment...</div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-7 relative min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
      >
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Submit Assignment</h2>
        <p className="text-gray-600 text-center mb-6">{assignment.title}</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Upload File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitAssignment;