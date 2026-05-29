import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ManageAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const { data } = await axios.get('http://localhost:5000/api/assignments');
    setAssignments(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this assignment?')) {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      fetchAssignments();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/api/assignments/${editing._id}`, form);
    } else {
      await axios.post('http://localhost:5000/api/assignments', form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', description: '', deadline: '' });
    fetchAssignments();
  };

  const openModal = (assignment = null) => {
    if (assignment) {
      setEditing(assignment);
      setForm(assignment);
    } else {
      setEditing(null);
      setForm({ title: '', description: '', deadline: '' });
    }
    setShowModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-7">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        ← Back
      </button>
      <div className="max-w-5xl mx-auto pt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Manage Assignments</h1>
          <button
            onClick={() => openModal()}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            + New Assignment
          </button>
        </div>

        <div className="space-y-4">
          {assignments.map(ass => (
            <div key={ass._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center hover:shadow-lg transition">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{ass.title}</h3>
                <p className="text-gray-600 mt-1">{ass.description}</p>
                <p className="text-sm text-red-500 mt-2">Due: {new Date(ass.deadline).toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openModal(ass)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ass._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit Assignment' : 'Create Assignment'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  required
                />
                <input
                  type="datetime-local"
                  value={form.deadline.slice(0, 16)}
                  onChange={e => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAssignments;