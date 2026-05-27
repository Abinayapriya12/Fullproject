import React, { useState } from 'react';

const API = 'http://localhost:5000/api/auth';

function ForgotPassword() {
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

  const handleSendOtp = async () => {
    if (!email) return showMessage('Email required');
    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, 'success');
        setView('otp');
      } else showMessage(data.message);
    } catch (err) { showMessage('Network error'); }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return showMessage('Enter 6-digit OTP');
    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, 'success');
        setView('reset');
      } else showMessage(data.message);
    } catch (err) { showMessage('Verification failed'); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return showMessage('Fill all fields');
    if (newPassword !== confirmPassword) return showMessage('Passwords do not match');
    if (newPassword.length < 4) return showMessage('Minimum 4 characters');
    try {
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, 'success'); // ✅ "Login successfully"
        setTimeout(() => {
          setView('login');
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else showMessage(data.message);
    } catch (err) { showMessage('Reset failed'); }
  };

  // Simple login demo (no actual backend needed for demo)
  const handleLogin = (e) => {
    e.preventDefault();
    // just to demonstrate the flow, we accept any non-empty
    if (email && newPassword) showMessage('Login successful (demo)', 'success');
    else showMessage('Enter credentials', 'error');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
        {view === 'login' && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 text-center">Welcome back</h1>
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border"
                value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-xl">Log in</button>
              <button type="button" onClick={() => { setView('forgot'); setMessage({ text: '', type: '' }); }} 
                className="w-full text-blue-600 text-sm hover:underline">Forgot password?</button>
            </form>
            {message.text && <div className={`mt-4 p-2 rounded-xl text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
          </div>
        )}

        {view === 'forgot' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Reset password</h2>
              <button onClick={() => setView('login')} className="text-sm bg-slate-100 px-3 py-1 rounded-full">← Back</button>
            </div>
            <div className="mb-4">
              <input type="email" placeholder="Registered email" className="w-full px-4 py-3 rounded-xl border"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button onClick={handleSendOtp} className="w-full bg-blue-700 text-white py-3 rounded-xl">Send OTP</button>
            {message.text && <div className={`mt-4 p-2 rounded-xl text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
          </div>
        )}

        {view === 'otp' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Verify OTP</h2>
              <button onClick={() => setView('forgot')} className="text-sm bg-slate-100 px-3 py-1 rounded-full">← Back</button>
            </div>
            <div className="mb-4">
              <input type="text" maxLength="6" placeholder="6-digit code" className="w-full px-4 py-3 rounded-xl border font-mono"
                value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSendOtp} className="flex-1 bg-slate-100 py-2.5 rounded-xl">Resend</button>
              <button onClick={handleVerifyOtp} className="flex-1 bg-blue-700 text-white py-2.5 rounded-xl">Verify →</button>
            </div>
            {message.text && <div className={`mt-4 p-2 rounded-xl text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
          </div>
        )}

        {view === 'reset' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Set new password</h2>
            <div className="space-y-4">
              <input type="password" placeholder="New password" className="w-full px-4 py-3 rounded-xl border"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <input type="password" placeholder="Confirm password" className="w-full px-4 py-3 rounded-xl border"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button onClick={handleResetPassword} className="w-full bg-emerald-700 text-white py-3 rounded-xl">Change password & login</button>
            </div>
            {message.text && <div className={`mt-4 p-2 rounded-xl text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;