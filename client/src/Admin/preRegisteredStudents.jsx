import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiUserPlus, FiX } from 'react-icons/fi';
import axios from 'axios';

function PreRegisteredStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');
  
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

  // Get auth token
  const getAuthToken = () => localStorage.getItem('token');

  // Fetch students based on active tab
  const fetchStudents = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    setError('');
    
    try {
      let url = 'http://localhost:5000/api/allstudents';
      if (activeTab === 'unregistered') {
        url = 'http://localhost:5000/api/unregistered';
      } else if (activeTab === 'registered') {
        url = 'http://localhost:5000/api/registered';
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setError('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // Add new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/addstudents',
        newStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert('Student added successfully!');
        // Reset form
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
        fetchStudents(); // Refresh list
      } else {
        setError(response.data.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) return;
    
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteregistered/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert('Student deleted successfully!');
        fetchStudents(); // Refresh list
      } else {
        setError(response.data.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setError(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch students when tab changes
  useEffect(() => {
    fetchStudents();
  }, [activeTab]);

  // Calculate statistics
  const getStats = () => {
    const total = students.length;
    const registered = students.filter(s => s.isRegistered).length;
    const unregistered = total - registered;
    return { total, registered, unregistered };
  };

  const stats = getStats();

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiUserPlus className="w-8 h-8" />
            <h3 className="text-xl font-bold">Pre-Registered Student Management</h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            {showAddForm ? <FiX /> : <FiPlus />} 
            {showAddForm ? 'Cancel' : 'Add New Student'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm text-gray-600 mb-1">Total Students</h4>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-sm text-gray-600 mb-1">Registered</h4>
            <p className="text-3xl font-bold text-green-600">{stats.registered}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-sm text-gray-600 mb-1">Pending Registration</h4>
            <p className="text-3xl font-bold text-yellow-600">{stats.unregistered}</p>
          </div>
        </div>

        {/* Add Student Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h4 className="text-lg font-bold mb-4 text-gray-800">Add New Student to Pre-Registration</h4>
            <form onSubmit={handleAddStudent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Student ID *</label>
                  <input
                    type="text"
                    placeholder="STU2024001"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: STU + 7 digits (e.g., STU2024001)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Username *</label>
                  <input
                    type="text"
                    value={newStudent.username}
                    onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Gender *</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Mobile *</label>
                  <input
                    type="tel"
                    placeholder="10 digits"
                    value={newStudent.mobile}
                    onChange={(e) => setNewStudent({...newStudent, mobile: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Exactly 10 digits, numbers only</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Age *</label>
                  <input
                    type="number"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({...newStudent, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Enrollment Year *</label>
                  <input
                    type="number"
                    value={newStudent.enrollmentYear}
                    onChange={(e) => setNewStudent({...newStudent, enrollmentYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Department *</label>
                  <input
                    type="text"
                    value={newStudent.department}
                    onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
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
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
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
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'all' 
                ? 'border-b-2 border-purple-500 text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Students ({stats.total})
          </button>
          <button
            onClick={() => handleTabChange('unregistered')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'unregistered' 
                ? 'border-b-2 border-purple-500 text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending ({stats.unregistered})
          </button>
          <button
            onClick={() => handleTabChange('registered')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'registered' 
                ? 'border-b-2 border-purple-500 text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Registered ({stats.registered})
          </button>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No students found.</p>
            <p className="text-sm mt-2">Click "Add New Student" to add your first student.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.enrollmentYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.isRegistered 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.isRegistered ? '✓ Registered' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {!student.isRegistered && (
                        <button
                          onClick={() => handleDeleteStudent(student.studentId, student.username)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 transition-colors"
                          title="Delete Student"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreRegisteredStudents;