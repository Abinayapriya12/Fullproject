import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('username');

    // If no user is logged in, redirect to login
    if (!role || !name) {
      navigate('/login');
      return;
    }

    setUserRole(role);
    setUsername(name);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="dashboard-container p-8">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {username}!</h1>
      <p className="text-gray-600 mt-2">Your role: <span className="font-semibold">{userRole}</span></p>

      <div className="mt-8 flex gap-4">
        {/* Conditionally render the Create button – hidden for role "user" */}
        {userRole !== 'user' && (
          <button
            onClick={() => navigate('/createbook')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Create Book
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* You can add more dashboard content here */}
    </div>
  );
}

export default Dashboard;