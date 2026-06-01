import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MySubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/submissions');
      let data = res.data;

      if (Array.isArray(data)) {
        // Keep only submissions with valid assignment and filePath (optional now)
        const validSubmissions = data.filter(sub => sub !== null && sub.assignment !== null);
        setSubmissions(validSubmissions);
      } else {
        console.warn('API did not return an array:', data);
        setSubmissions([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load your submissions. Please try again.');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Improved download handler with full URL construction and fallback
  const handleDownload = async (sub) => {
    const filePath = sub?.filePath;
    console.log('🔍 Raw filePath from DB:', filePath);

    if (!filePath) {
      alert('❌ No file associated with this submission. The file path is missing in the database.');
      return;
    }

    // Build the correct URL
    let fullUrl;
    if (filePath.startsWith('http')) {
      fullUrl = filePath;
    } else {
      // Remove any leading 'uploads/' or '/uploads/' to avoid duplication
      const cleanPath = filePath.replace(/^\/?uploads\//, '');
      fullUrl = `http://localhost:5000/uploads/${cleanPath}`;
    }
    console.log('🌐 Constructed URL:', fullUrl);

    setDownloadingId(sub._id);
    try {
      // First, try to fetch the file to see if it exists
      const response = await axios.get(fullUrl, { responseType: 'blob' });
      if (response.status === 200) {
        // Create a blob URL and open in new tab
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        // Revoke after a short delay to free memory
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
      } else {
        alert('⚠️ File exists but could not be opened.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      if (error.response?.status === 404) {
        alert('❌ File not found on server. The file may have been deleted or the path is incorrect.');
      } else {
        alert('❌ Download failed. Check your network connection or server status.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-7 flex justify-center items-center">
        <div className="text-gray-600">Loading your submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-7 flex justify-center items-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-7">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
      >
        ← Back
      </button>
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">📄 My Submissions</h1>
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center text-gray-500">
            You haven't submitted any assignment yet.
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map(sub => {
              if (!sub || !sub.assignment) return null;
              return (
                <div key={sub._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {sub.assignment.title || 'Untitled Assignment'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                      {sub.grade !== undefined && sub.grade !== null && (
                        <p className="mt-2 text-green-600 font-medium">Grade: {sub.grade} / 100</p>
                      )}
                      {sub.feedback && (
                        <p className="mt-1 text-gray-700 italic">Feedback: {sub.feedback}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDownload(sub)}
                      disabled={downloadingId === sub._id}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === sub._id ? 'Opening...' : 'Open File →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubmissions;