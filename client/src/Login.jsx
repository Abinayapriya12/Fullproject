import React, { useState } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password flow state
  const [view, setView] = useState('login'); // login, forgot, otp, reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
        
    try {
      const response = await axios.post("http://localhost:5000/api/user-login", {
        username,
        password
      });

      console.log(response.data);

      if (response.data.message === "Login successful") {
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("username", username);

        setUsername("");
        setPassword("");

        navigate("/dashboard");
      } else {
        showMessage(response.data.message || "Login failed");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      console.log("Full error response:", err.response);  
      console.log(err.message);
      showMessage(err.response?.data?.message || "Network error");
      setUsername("");
      setPassword("");
    }
  };

   // Forgot password: send OTP
  const handleSendOtp = async () => {
    if (!email) return showMessage('Email required');
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
      if (res.data.message) {
        showMessage(res.data.message, 'success');
        setView('otp');
      } else {
        showMessage(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Network error");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return showMessage('Enter 6-digit OTP');
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      if (res.data.message) {
        showMessage(res.data.message, 'success');
        setView('reset');
      } else {
        showMessage(res.data.message || "Verification failed");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Verification failed");
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return showMessage('Fill all fields');
    if (newPassword !== confirmPassword) return showMessage('Passwords do not match');
    if (newPassword.length < 4) return showMessage('Minimum 4 characters');
    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        email, otp, newPassword, confirmPassword
      });
      if (res.data.message) {
        showMessage(res.data.message, 'success');
        setTimeout(() => {
          // Clear forgot states and go back to login
          setView('login');
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        showMessage(res.data.message || "Reset failed");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Reset failed");
    }
  };

  // Resend OTP (reuse send OTP)
  const handleResendOtp = () => {
    handleSendOtp();
  };

  // Common message display
  const renderMessage = () => (
    message.text && (
      <div className={`mt-4 p-2 rounded-xl text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {message.text}
      </div>
    )
  );

  return (
    <div className="flex items-center justify-center p-14">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* LOGIN VIEW */}
        {view === 'login' && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setMessage({ text: '', type: '' });
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Forgot Password?
                  </button>
                </p>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
                <p className="text-center mt-4">
                  Don’t have an account?
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-blue-500 hover:text-blue-700 ml-1 font-semibold"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
            {renderMessage()}
          </>
        )}

        {/* FORGOT PASSWORD - REQUEST OTP */}
        {view === 'forgot' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Reset password</h2>
              <button
                onClick={() => setView('login')}
                className="text-sm bg-slate-100 px-3 py-1 rounded-full"
              >
                ← Back
              </button>
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Registered email"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition"
            >
              Send OTP
            </button>
            {renderMessage()}
          </>
        )}

        {/* OTP VERIFICATION */}
        {view === 'otp' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Verify OTP</h2>
              <button
                onClick={() => setView('forgot')}
                className="text-sm bg-slate-100 px-3 py-1 rounded-full"
              >
                ← Back
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                maxLength="6"
                placeholder="6-digit code"
                className="w-full px-4 py-3 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResendOtp}
                className="flex-1 bg-slate-100 py-2.5 rounded-xl hover:bg-slate-200 transition"
              >
                Resend
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 bg-blue-700 text-white py-2.5 rounded-xl hover:bg-blue-800 transition"
              >
                Verify →
              </button>
            </div>
            {renderMessage()}
          </>
        )}

        {/* RESET PASSWORD */}
        {view === 'reset' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Set new password</h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleResetPassword}
                className="w-full bg-emerald-700 text-white py-3 rounded-xl hover:bg-emerald-800 transition"
              >
                Change password & login
              </button>
            </div>
            {renderMessage()}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;