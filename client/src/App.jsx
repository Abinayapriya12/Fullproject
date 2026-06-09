import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'; 
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
import AllSubmissions from './Assignmentsubmissioncomponnent/AllSubmissions'
import AssignmentList from './Assignmentsubmissioncomponnent/AssignmentList';
import ManageAssignment from './Assignmentsubmissioncomponnent/ManageAssignments';
import MySubmissions from './Assignmentsubmissioncomponnent/MySubmissions';
import SubmitAssignments from './Assignmentsubmissioncomponnent/SubmitAssignment';
import DiscussionForum from './Components/DiscussionForum';

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);
    
    const toggleTheme = () => {
        const html = document.documentElement;
        if (darkMode) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDarkMode(!darkMode);
    };
 
    // Axios interceptor
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    return (
        <BrowserRouter>
            <div className={`transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                {/* Navigation Bar */}
                <nav className={`shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-blue-400'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex space-x-8">
                                <Link
                                    to="/register"
                                    className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md ${darkMode
                                            ? 'text-gray-200 hover:text-indigo-400 hover:bg-gray-700'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    Register
                                </Link>
                                <Link
                                    to="/login"
                                    className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md ${darkMode
                                            ? 'text-gray-200 hover:text-indigo-400 hover:bg-gray-700'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md ${darkMode
                                            ? 'text-gray-200 hover:text-indigo-400 hover:bg-gray-700'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            </div>

                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className={`flex items-center px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                        : 'bg-white text-gray-700 hover:bg-indigo-50'
                                    }`}
                                aria-label="Toggle theme"
                            >
                                {darkMode ? (
                                    <><Sun size={18} className="text-yellow-500" /> Light Mode</>
                                ) : (
                                    <><Moon size={18} className="text-indigo-600" /> Dark Mode</>
                                )}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/books" element={
                            <PrivateRoute>
                                <Books />
                            </PrivateRoute>
                        } />
                        <Route path="/createbook" element={
                            <PrivateRoute>
                                <Createbook />
                            </PrivateRoute>
                        } />
                        <Route path="/getall" element={
                            <PrivateRoute>
                                <Getall />
                            </PrivateRoute>
                        } />
                        <Route path="/studentdetails" element={
                            <PrivateRoute>
                                <Studentdetails />
                            </PrivateRoute>
                        } />
                        <Route path="/createstudent" element={
                            <PrivateRoute>
                                <Createstudent />
                            </PrivateRoute>
                        } />
                        <Route path="/getstudentdetails" element={
                            <PrivateRoute>
                                <Getstudentdetails />
                            </PrivateRoute>
                        } />
                        <Route path="/manageassignments" element={
                            <PrivateRoute>
                                <ManageAssignment />
                            </PrivateRoute>
                        } />
                        <Route path="/allsubmissions" element={
                            <PrivateRoute>
                                <AllSubmissions />
                            </PrivateRoute>
                        } />
                        <Route path="/assignmentlist" element={
                            <PrivateRoute>
                                <AssignmentList />
                            </PrivateRoute>
                        } />
                        <Route path="/mysubmissions" element={
                            <PrivateRoute>
                                <MySubmissions />
                            </PrivateRoute>
                        } />
                        <Route path="/submitassignments/:id" element={
                            <PrivateRoute>
                                <SubmitAssignments />
                            </PrivateRoute>
                        } />
                        <Route path="/forum" element={
                            <PrivateRoute>
                                <DiscussionForum />
                            </PrivateRoute>
                        } />
                        <Route path="/discussion" element={
                            <PrivateRoute>
                                <DiscussionForum />
                            </PrivateRoute>
                        } />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;