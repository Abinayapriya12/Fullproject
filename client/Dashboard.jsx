import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiLogOut } from 'react-icons/fi';

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

  const isRegularUser = userRole === 'user';

  return (
    <div className="min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-11">
       
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-4 text-white">
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
      </div>
    </div>
  );
}

export default Dashboard;