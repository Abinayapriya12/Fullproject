import React, { useState, useRef } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 const roleRef = useRef("Student");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Trim all string inputs
  
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMobile = mobile.trim();
    const ageNumber = parseInt(age, 10);
   const trimmedRole = roleRef.current.value.trim(); 
   

    // Basic validation (including role)
    if (!trimmedUsername || !password || !trimmedEmail || !gender || !trimmedMobile || !age || !trimmedRole) {
      setError("All fields are required");
      return;
    }

    // Role validation – only Student or Admin allowed
    if (trimmedRole !== "student" && trimmedRole !== "admin") {
      setError("Only Student and Admin roles are allowed to register");
      return;
    }

    if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 100) {
      setError("Age must be a valid number between 1 and 100");
      return;
    }

    // Validate mobile number (10 digits, no letters/symbols)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(trimmedMobile)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/api/user-register", {
        username: trimmedUsername,
        password: password,
        email: trimmedEmail,
        gender: gender,
        mobile: trimmedMobile,
        age: ageNumber,
        role: trimmedRole,          // NEW: send role to backend
      });

      console.log("Registered successfully", response.data);
      
      // Clear form only on success
      setUsername("");
      setPassword("");
      setEmail("");
      setGender("");
      setMobile("");
      setAge("");
      

      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        const serverMessage = err.response.data?.message || err.response.data?.error || err.response.statusText;
        setError(`Registration failed: ${serverMessage}`);
        console.log("Server error details:", err.response.data);
      } else if (err.request) {
        setError("Network error: Cannot connect to server. Please check if backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">

            <label className="block text-gray-700 font-semibold">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />

            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />

            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />

            <label className="block text-gray-700 font-semibold">Gender</label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isSubmitting}
                /> Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isSubmitting}
                /> Female
              </label>
            </div>

            <label className="block text-gray-700 font-semibold">Mobile</label>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />

            <label className="block text-gray-700 font-semibold">Age</label>
            <input
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />

            {/* NEW: Role selection dropdown */}
            <label className="block text-gray-700 font-semibold">Role</label>
            <select
            ref={roleRef}
               defaultValue="Student"
              autoComplete="off" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            >
              <option value="student">sudent</option>
              <option value="admin">admin</option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-md text-white ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p className="text-center mt-4">
              Already registered?
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 ml-1 font-semibold"
                disabled={isSubmitting}
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