// DiscussionForum.jsx
import React, { useState, useEffect } from 'react';
import { discussionApi } from '../services/discussionApi';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModel'
import { FiMessageCircle, FiSearch, FiFilter } from 'react-icons/fi';

const DiscussionForum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [filters, setFilters] = useState({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        search: ''
    });

    // Get current user from localStorage
    const currentUser = {
        username: localStorage.getItem("username"),
        role: localStorage.getItem("userRole"),
        token: localStorage.getItem("token")
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await discussionApi.getAllPosts({
                page: pagination.currentPage,
                limit: 10,
                ...filters
            });
            setPosts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [pagination.currentPage, filters.sortBy, filters.search]);

    const handleLike = async (postId) => {
        try {
            const response = await discussionApi.toggleLike(postId);
            setPosts(posts.map(post => 
                post._id === postId 
                    ? { ...post, likesCount: response.data.likesCount }
                    : post
            ));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleAddComment = async (postId, content) => {
        try {
            const response = await discussionApi.addComment(postId, content);
            setPosts(posts.map(post =>
                post._id === postId
                    ? { ...post, comments: [...post.comments, response.data.data] }
                    : post
            ));
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await discussionApi.deletePost(postId);
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post');
            }
        }
    };

    const handleUpdatePost = async (postId, title, content) => {
        try {
            await discussionApi.updatePost(postId, { title, content });
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        }
    };

    const handlePinPost = async (postId) => {
        try {
            await discussionApi.togglePin(postId);
            fetchPosts();
        } catch (error) {
            console.error('Error pinning post:', error);
            alert('Failed to pin/unpin post');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (window.confirm('Delete this comment?')) {
            try {
                await discussionApi.deleteComment(postId, commentId);
                fetchPosts();
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment');
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Forum Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FiMessageCircle className="w-6 h-6" />
                            Course Discussion Forum
                        </h2>
                        <p className="text-purple-100 mt-1">
                            Ask doubts, share knowledge, and help others
                        </p>
                    </div>
                    {currentUser.role === 'student' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                            <FiMessageCircle /> Ask Question
                        </button>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, currentPage: 1 })}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-400" />
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, currentPage: 1 })}
                            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
                        >
                            <option value="createdAt">Newest First</option>
                            <option value="likesCount">Most Liked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No discussions yet. Be the first to ask a question!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUser={currentUser}
                                onLike={handleLike}
                                onAddComment={handleAddComment}
                                onDeletePost={handleDeletePost}
                                onUpdatePost={handleUpdatePost}
                                onPinPost={handlePinPost}
                                onDeleteComment={handleDeleteComment}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={fetchPosts}
            />
        </div>
    );
};

export default DiscussionForum;