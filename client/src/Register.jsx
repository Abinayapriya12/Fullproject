import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [formResetKey, setFormResetKey] = useState(Date.now());

  useEffect(() => {
    clearForm();
  }, []);

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setGender('');
    setMobile('');
    setAge('');
    setStudentId('');
    setDepartment('');
    setEnrollmentYear('');
    setError('');
    setSelectedRole('student');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const freshUsername = username.trim();
    const freshPassword = password;
    const freshEmail = email.trim().toLowerCase();
    const freshGender = gender;
    const freshMobile = mobile.trim();
    const freshAge = parseInt(age, 10);
    const freshStudentId = studentId.trim().toUpperCase();
    const freshDepartment = department.trim();
    const freshEnrollmentYear = parseInt(enrollmentYear, 10);

    if (!freshUsername || !freshPassword || !freshEmail || !freshGender || !freshMobile || !freshAge) {
      setError("All basic fields are required");
      return;
    }

    if (selectedRole === "student") {
      
      if (!freshStudentId || !freshDepartment || !freshEnrollmentYear) {
        setError("Student ID, Department, and Enrollment Year are required");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        username: freshUsername,
        password: freshPassword,
        email: freshEmail,
        gender: freshGender,
        mobile: freshMobile,
        age: freshAge,
        role: selectedRole,
      };

      if (selectedRole === "student") {
        requestData.studentId = freshStudentId;  // FIXED: Use camelCase
        requestData.department = freshDepartment;
        requestData.enrollmentYear = freshEnrollmentYear;
      }

      console.log("Sending data:", requestData);

      const response = await axios.post("http://localhost:5000/api/user-register", requestData);

      console.log("Success:", response.data);

      clearForm();
      setFormResetKey(Date.now());

      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Registration failed");
      } else {
        setError("Network error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-center">
            {error}
          </div>
        )}

        <form key={formResetKey} onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Username *</label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Gender *</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isSubmitting}
                    className="mr-1"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isSubmitting}
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mobile *</label>
              <input
                type="tel"
                name="mobile"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Age *</label>
              <input
                type="number"
                name="age"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Role *</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {selectedRole === "student" && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Student ID *</label>
                  <input
                    type="text"
                    name="studentId"  // FIXED: Use "studentId"
                    placeholder="STU2024001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    autoComplete="off"
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Department *</label>
                  <select
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electronics Engineering">Electronics Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Enrollment Year *</label>
                  <input
                    type="number"
                    name="enrollmentYear"
                    placeholder="e.g., 2024"
                    value={enrollmentYear}
                    onChange={(e) => setEnrollmentYear(e.target.value)}
                    autoComplete="off"
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p className="text-center mt-4">
              Already have an account?
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 ml-1 font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;