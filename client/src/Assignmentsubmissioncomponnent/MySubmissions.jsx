import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MySubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/submissions')
      .then(res => setSubmissions(res.data))
      .catch(err => console.error('Error fetching submissions:', err));
  }, []);

  const handleDownload = async (sub) => {
    const filePath = sub.filePath;
    if (!filePath) {
      alert('No file associated with this submission.');
      return;
    }

    // Construct full URL – adjust the base path to match your backend's static folder
    let fullUrl;
    if (filePath.startsWith('http')) {
      fullUrl = filePath;
    } else {
      // Assumes files are stored under /uploads/ on your backend
      fullUrl = `http://localhost:5000/uploads/${filePath.replace(/^\/uploads\//, '')}`;
    }

    setDownloadingId(sub._id);
    try {
      const response = await axios.get(fullUrl, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from path or use assignment title
      const filename = filePath.split('/').pop() || `${sub.assignment.title}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. The file may not exist on the server.');
    } finally {
      setDownloadingId(null);
    }
  };

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
            {submissions.map(sub => (
              <div key={sub._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{sub.assignment.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                    {sub.grade !== undefined && (
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
                    {downloadingId === sub._id ? 'Downloading...' : 'Download File →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubmissions;