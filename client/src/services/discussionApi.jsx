// src/services/discussionApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const discussionApi = {
    // Make sure all endpoints have '/discussions/' prefix
    getAllPosts: (params) => api.get('/discussions/posts', { params }),
    getPostById: (id) => api.get(`/discussions/posts/${id}`),
    createPost: (data) => api.post('/discussions/posts', data),  // Fixed: added 'discussions/'
    updatePost: (id, data) => api.put(`/discussions/posts/${id}`, data),
    deletePost: (id) => api.delete(`/discussions/posts/${id}`),
    toggleLike: (id) => api.post(`/discussions/posts/${id}/like`),
    addComment: (id, content) => api.post(`/discussions/posts/${id}/comments`, { content }),
    deleteComment: (postId, commentId) => api.delete(`/discussions/posts/${postId}/comments/${commentId}`),
    togglePin: (id) => api.patch(`/discussions/posts/${id}/pin`),
    getMyPosts: (params) => api.get('/discussions/my-posts', { params })
};

export default api;