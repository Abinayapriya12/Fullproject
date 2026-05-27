import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiUser,
  FiBookOpen,
  FiCalendar,
  FiArrowLeft,
  FiEye,
  FiTrash2,
} from 'react-icons/fi';

function Getstudentdetails() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');

  const userRole = localStorage.getItem('userRole');

  // Fetch Students
  const fetchStudents = () => {
    axios
      .get('http://localhost:5000/api/students')
      .then((res) => {
        setStudents(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // View Student
  const handleView = (student) => {
    setSelectedStudent(student);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
    setCourse(student.course);
    setGrade(student.grade);
    setShowModal(true);
  };

  // Delete Student
  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${studentId}`);
        fetchStudents();

        if (selectedStudent && selectedStudent._id === studentId) {
          setShowModal(false);
          setSelectedStudent(null);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Update Student
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${selectedStudent._id}`,
        {
          name,
          email,
          age,
          course,
          grade,
        }
      );

      if (response.data.success) {
        setShowModal(false);
        fetchStudents();

        setName('');
        setEmail('');
        setAge('');
        setCourse('');
        setGrade('');
        setSelectedStudent(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-10 bg-white hover:bg-gray-100 text-gray-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map((student, index) => (
            <div
              key={student._id || index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {student.name}
              </h3>

              <div className="space-y-2 mt-4">
                <div className="flex items-center text-gray-600">
                  <FiUser className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Email:{' '}
                    <span className="font-medium text-gray-900">
                      {student.email}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Age:{' '}
                    <span className="font-medium text-gray-900">
                      {student.age}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiBookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Course:{' '}
                    <span className="font-medium text-gray-900">
                      {student.course}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiUser className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Grade:{' '}
                    <span className="font-medium text-gray-900">
                      {student.grade}
                    </span>
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleView(student)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </button>

                {userRole === 'admin' && (
                  <button
                    onClick={() => handleDelete(student._id || student.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center justify-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedStudent.name}
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age:
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course:
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade:
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                {userRole === 'admin' && (
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Update
                  </button>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className={`${
                    userRole === 'admin' ? 'flex-1' : 'w-full'
                  } bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition duration-200`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Getstudentdetails;