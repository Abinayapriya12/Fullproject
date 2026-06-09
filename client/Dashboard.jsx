import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiFileText, FiLogOut, FiPlus, FiEye, FiTrash2, FiUserPlus, FiMessageCircle } from 'react-icons/fi';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showStudentManagement, setShowStudentManagement] = useState(true);
  
  // State for student management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form state for adding new student
  const [newStudent, setNewStudent] = useState({
    studentId: '',
    username: '',
    email: '',
    gender: 'Male',
    mobile: '',
    age: '',
    enrollmentYear: new Date().getFullYear(),
    department: ''
  });

  useEffect(() => {
    const name = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if (!name || !role || !token) {
      navigate('/login');
    }
    setUsername(name);
    setUserRole(role);
  }, [navigate]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchStudents = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      let response;
      
      if (activeTab === 'unregistered') {
        response = await axios.get('http://localhost:5000/api/unregistered', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (activeTab === 'registered') {
        response = await axios.get('http://localhost:5000/api/registered', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/addstudents',
        newStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert('Student added successfully!');
        setNewStudent({
          studentId: '',
          username: '',
          email: '',
          gender: 'Male',
          mobile: '',
          age: '',
          enrollmentYear: new Date().getFullYear(),
          department: ''
        });
        setShowAddForm(false);
        fetchStudents();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  // Updated delete function with better error handling
  const handleDeleteStudent = async (studentIdentifier, studentName, isRegistered) => {
    let confirmMessage = `Are you sure you want to delete ${studentName}?`;
    if (isRegistered) {
      confirmMessage = `⚠️ WARNING: ${studentName} has already registered an account.\n\nDeleting will also remove their user account and all associated data.\n\nAre you sure you want to proceed?`;
    }
    
    if (!window.confirm(confirmMessage)) return;
    
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      console.log('Deleting student with identifier:', studentIdentifier);
      
      const response = await axios.delete(
        `http://localhost:5000/api/deleteregistered/${studentIdentifier}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert(response.data.message || 'Student deleted successfully!');
        fetchStudents(); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete student';
      alert(`Delete failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isRegularUser = userRole === 'student';
  const isAdmin = userRole === 'admin';

  const getStats = () => {
    const total = students.length;
    const registered = students.filter(s => s.isRegistered).length;
    const unregistered = total - registered;
    return { total, registered, unregistered };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-300 p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Book Management Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiBook className="w-8 h-8" />
              <h3 className="text-xl font-bold">Book Management</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {isAdmin && (
              <button
                onClick={() => navigate('/createbook')}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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

        {/* Student Management Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiUsers className="w-8 h-8" />
              <h3 className="text-xl font-bold">Student Management</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/createstudent')}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Create Student
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/getstudentdetails')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              View All Students
            </button>
          </div>
        </div>

        {/* Assignment Management Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiFileText className="w-8 h-8" />
              <h3 className="text-xl font-bold">Assignment Portal</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/manageassignments')}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Manage Assignments
                </button>
                <button
                  onClick={() => navigate('/allsubmissions')}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  View All Submissions
                </button>
              </>
            )}
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

        {/* Course Discussion & Doubt Forum Card - ADDED */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <FiMessageCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Discussion Forum</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={() => navigate('/forum')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <FiMessageCircle /> Go to Forum
            </button>
            <p className="text-xs text-gray-500 text-center">
              Ask doubts, help others, discuss topics
            </p>
          </div>
        </div>
      </div>

      {/* Admin Student Management Section */}
      {isAdmin && showStudentManagement && (
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiUserPlus className="w-8 h-8" />
                <h3 className="text-xl font-bold">Pre-Registered Student Management</h3>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                <FiPlus /> Add New Student
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="text-sm text-gray-600">Total Students</h4>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h4 className="text-sm text-gray-600">Registered</h4>
                <p className="text-2xl font-bold text-green-600">{stats.registered}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h4 className="text-sm text-gray-600">Pending Registration</h4>
                <p className="text-2xl font-bold text-yellow-600">{stats.unregistered}</p>
              </div>
            </div>

            {/* Add Student Form */}
            {showAddForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-bold mb-4">Add New Student to Pre-Registration</h4>
                <form onSubmit={handleAddStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Student ID *</label>
                      <input
                        type="text"
                        placeholder="STU2024001"
                        value={newStudent.studentId}
                        onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                      <p className="text-xs text-gray-500">Format: STU + 7 digits</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Username *</label>
                      <input
                        type="text"
                        value={newStudent.username}
                        onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender *</label>
                      <select
                        value={newStudent.gender}
                        onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Mobile *</label>
                      <input
                        type="tel"
                        placeholder="10 digits"
                        value={newStudent.mobile}
                        onChange={(e) => setNewStudent({...newStudent, mobile: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Age *</label>
                      <input
                        type="number"
                        value={newStudent.age}
                        onChange={(e) => setNewStudent({...newStudent, age: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Enrollment Year *</label>
                      <input
                        type="number"
                        value={newStudent.enrollmentYear}
                        onChange={(e) => setNewStudent({...newStudent, enrollmentYear: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Department *</label>
                      <input
                        type="text"
                        value={newStudent.department}
                        onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                      {loading ? 'Adding...' : 'Add Student'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => {
                  setActiveTab('all');
                  fetchStudents();
                }}
                className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              >
                All Students ({stats.total})
              </button>
              <button
                onClick={() => {
                  setActiveTab('unregistered');
                  fetchStudents();
                }}
                className={`px-4 py-2 ${activeTab === 'unregistered' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              >
                Pending ({stats.unregistered})
              </button>
              <button
                onClick={() => {
                  setActiveTab('registered');
                  fetchStudents();
                }}
                className={`px-4 py-2 ${activeTab === 'registered' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              >
                Registered ({stats.registered})
              </button>
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students found. Click "Add New Student" to add.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            student.isRegistered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.isRegistered ? '✓ Registered' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Show delete button for all students, but with different behavior */}
                          <button
                            onClick={() => handleDeleteStudent(student.studentId, student.username, student.isRegistered)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            disabled={loading}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;