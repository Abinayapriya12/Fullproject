 import React from 'react'
import { useNavigate } from 'react-router-dom'

function Admin1() {
  const navigate = useNavigate()
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-7">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
      >
        ← Back
      </button>
      
      <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
        <div className="text-center pb-8">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            <b>Students Details</b>
          </div>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => navigate("/createstudent")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
             Create Student
          </button>
          
          <button 
            onClick={() => navigate("/getstudentdetails")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
             View All student Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin1 