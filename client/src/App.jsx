import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import Books from './Components/Books';
import Createbook from './Components/createbook';
import Getall from './Components/Getall';
import Studentdetails from './Components/Studentdetails';
import Createstudent from './Components/createstudent';
import Getstudentdetails from './Components/Getstudentdetails';
import Dashboard from '../Dashboard';  

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-400 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-8 py-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-indigo-50"
              >
                Register
              </Link>
              <Link
                to="/Login"
                className="text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-indigo-50"
              >
                Login
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-indigo-50"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/createbook" element={<Createbook />} />
            <Route path="/getall" element={<Getall />} />
            <Route path="/studentdetails" element={<Studentdetails />} />
            <Route path="/createstudent" element={<Createstudent />} />
            <Route path="/getstudentdetails" element={<Getstudentdetails />} />
            
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;