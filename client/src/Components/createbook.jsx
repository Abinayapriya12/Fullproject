import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function Createbook() {
  const navigate = useNavigate();
  const [state, setState] = useState({})
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [publishedYear, setPublishorYear] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/books",
      {
        title: title,
        author: author,
        category: category,
        publishedYear: publishedYear
      })
      .then(response => {
        console.log(response.data)
        setState(response.data)
      })
    setTitle("")
    setAuthor("")
    setCategory("")
    setPublishorYear("")
      .catch((err) => console.log("error:", err))
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="publishor"
              value={publishedYear}
              onChange={(e) => setPublishorYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <button
              type='Submit'
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium mt-4"
            >
              Create book
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Createbook