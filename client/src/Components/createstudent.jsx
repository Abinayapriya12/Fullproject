import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Createstudent() { 
    const navigate = useNavigate();
    const [state, setState] = useState({})
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[age,setAge]=useState("") 
    const[course,setCourse]=useState("")
    const[grade,setGrade]=useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/api/students", {
           name:name,
           email:email,
           age:age,
           course:course,
           grade:grade
        })
        .then(response => {
            console.log(response.data)        
            setState(response.data)
            setName("")
            setEmail("")
            setAge("")
            setCourse("")
            setGrade("")
        })
        .catch((err) => console.log("error:",err))           
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-7 relative">
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
            >
                ← Back
            </button>
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create student</h2>   
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                        <input
                            type="Number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                        <input
                            type="text"
                            placeholder="course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                          <input
                            type="text"
                            placeholder="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                        <button 
                            type='Submit' 
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium mt-4"
                        >
                            Create student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Createstudent