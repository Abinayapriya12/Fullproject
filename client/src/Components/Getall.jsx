import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {FiBookOpen,FiUser,FiCalendar,FiGrid,FiArrowLeft,FiEye,FiTrash2}from 'react-icons/fi';

function Getall() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [author, setAuthor] = useState('');
  const [category,setCategory]=useState('');
  const [publishedyear,setPublishedyear]=useState('');

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Fetch Books
  const fetchBooks = () => {
    axios
      .get('http://localhost:5000/api/getbooks')
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // View Book - FIXED: Now sets all three fields
  const handleView = (book) => {
    setSelectedBook(book);
    setAuthor(book.author);
    setCategory(book.category);      
    setPublishedyear(book.publishedyear); 
    setShowModal(true);
  };

  // Delete Book
  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:5000/api/deletebook/${bookId}`);
        fetchBooks();

        if (selectedBook && selectedBook._id === bookId) {
          setShowModal(false);
          setSelectedBook(null);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Update Author
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/updatebook/${selectedBook._id}`,
        {
          author: author,
          category: category,
          publishedyear: publishedyear
        }
      );

      if (response.data.success) {
        console.log(response.data.data);
        setShowModal(false);
        fetchBooks();
        // Reset form
        setAuthor('');
        setCategory('');
        setPublishedyear('');
        setSelectedBook(null);
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
          {books.map((book, index) => (
            <div
              key={book._id || index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {book.title}
              </h3>

              <div className="space-y-2 mt-4">
                <div className="flex items-center text-gray-600">
                  <FiUser className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Author:{' '}
                    <span className="font-medium text-gray-900">
                      {book.author}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiGrid className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Category:{' '}
                    <span className="font-medium text-gray-900">
                      {book.category}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    PublishedYear: {book.publishedyear}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleView(book)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </button>
               
                {userRole === 'admin' &&(
                <button
                  onClick={() => handleDelete(book._id || book.id)}
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
      {showModal && selectedBook && (
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
                {selectedBook.title}
              </h3>

              <div className="space-y-4">
                {/* Author - only editable for admin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author:
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category:
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                      disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Published Year:
                  </label>
                  <input
                    type="number"
                    value={publishedyear}
                    onChange={(e) => setPublishedyear(e.target.value)}
                    disabled={userRole !== 'admin'}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                      userRole !== 'admin' ? 'bg-gray-100' : '' }`}/>
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

export default Getall;