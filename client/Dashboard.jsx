import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiFileText, FiLogOut } from 'react-icons/fi';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');

    if (!name || !role) {
      navigate('/login');
    }
    setUsername(name);
    setUserRole(role);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isRegularUser = userRole === 'student';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {username} ({userRole})
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Book Management Card (existing) */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className=" bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiBook className="w-8 h-8" />
              <h3 className="text-xl font-bold">Book Management</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {!isRegularUser && (
              <button
                onClick={() => navigate('/createbook')}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Create Book
              </button>
            )}
            <button
              onClick={() => navigate('/getall')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              View All Books
            </button>
          </div>
        </div>

        {/* Student Management Card (existing) */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiUsers className="w-8 h-8" />
              <h3 className="text-xl font-bold">Student Management</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {!isRegularUser && (
              <button
                onClick={() => navigate('/createstudent')}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Create Student
              </button>
            )}
            <button
              onClick={() => navigate('/getstudentdetails')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              View All Students
            </button>
          </div>
        </div>

        {/* 🆕 Assignment Management Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className=" bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiFileText className="w-8 h-8" />
              <h3 className="text-xl font-bold">Assignment Portal</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {/* Admin actions */}
            {!isRegularUser && (
              <>
                <button
                  onClick={() => navigate('/manageassignments')}
                  className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                  Manage Assignments 
                </button>
                <button
                  onClick={() => navigate('/allsubmissions')}
                  className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                >
                  View All Submissions
                </button>
              </>
            )}
            {/* Student actions */}
            {isRegularUser && (
              <>
                <button
                  onClick={() => navigate('/assignmentlist')}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  View & Submit Assignments
                </button>
                <button
                  onClick={() => navigate('/mysubmissions')}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  My Submissions & Grades
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;