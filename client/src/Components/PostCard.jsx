// src/components/PostCard.jsx
import React, { useState } from 'react';
import { FiHeart, FiMessageSquare, FiTrash2, FiEdit2, FiFlag} from 'react-icons/fi';
const PostCard = ({ 
    post, 
    currentUser, 
    onLike, 
    onAddComment, 
    onDeletePost, 
    onUpdatePost,
    onPinPost, 
    onDeleteComment 
}) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editContent, setEditContent] = useState(post.content);

    const isLiked = post.likes?.includes(currentUser?._id);
    const isAuthor = post.authorName === currentUser?.username;
    const isAdmin = currentUser?.role === 'admin'; // This determines if admin buttons show

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            await onAddComment(post._id, commentText);
            setCommentText('');
        }
    };

    const handleSaveEdit = () => {
        if (editTitle.trim() && editContent.trim()) {
            onUpdatePost(post._id, editTitle, editContent);
            setIsEditing(false);
        }
    };

    return (
        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-lg font-semibold w-full border rounded px-2 py-1 mb-2"
                        />
                    ) : (
                        <h3 className="text-lg font-semibold text-gray-800">
                            {post.title}
                            {post.isPinned && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                    <FiFlag className="inline mr-1" size={12} /> Pinned
                                </span>
                            )}
                        </h3>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>By: {post.authorName}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                        {post.authorRole === 'admin' && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Admin</span>
                        )}
                        {isAdmin && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">You are Admin</span>
                        )}
                    </div>
                </div>
                
                {/* Action Buttons - Admin gets extra buttons */}
                <div className="flex gap-2">
                    {/* Pin button - Admin only */}
                    {isAdmin && !isEditing && (
                        <button
                            onClick={() => onPinPost(post._id)}
                            className={`p-1 rounded ${post.isPinned ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'}`}
                            title={post.isPinned ? "Unpin Post" : "Pin Post"}
                        >
                            <FiFlag size={18} />
                        </button>
                    )}
                    
                    {/* Edit button - Author only */}
                    {(isAuthor || isAdmin) && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Edit Post"
                        >
                            <FiEdit2 size={18} />
                        </button>
                    )}
                    
                    {/* Delete button - Author or Admin */}
                    {(isAuthor || isAdmin) && !isEditing && (
                        <button
                            onClick={() => onDeletePost(post._id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Post"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Post Content */}
            {isEditing ? (
                <div className="mb-3">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-2"
                        rows="4"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-200 rounded">
                            Cancel
                        </button>
                        <button onClick={handleSaveEdit} className="px-3 py-1 bg-blue-500 text-white rounded">
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-700 mb-3">{post.content}</p>
            )}

            {/* Interaction Buttons */}
            {!isEditing && (
                <>
                    <div className="flex items-center gap-4 mb-3">
                        <button
                            onClick={() => onLike(post._id)}
                            className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                        >
                            <FiHeart /> {post.likesCount || 0} Likes
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                        >
                            <FiMessageSquare /> {post.comments?.length || 0} Comments
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="border-t pt-3 mt-2">
                            <form onSubmit={handleSubmitComment} className="mb-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="flex-1 border rounded px-3 py-1 text-sm"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                        Post
                                    </button>
                                </div>
                            </form>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {post.comments?.map(comment => (
                                    <div key={comment._id} className="bg-gray-50 rounded p-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-sm">{comment.authorName}</span>
                                            <div className="flex gap-2">
                                                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                                {/* Delete comment button - Author or Admin */}
                                                {(currentUser?.username === comment.authorName || isAdmin) && (
                                                    <button
                                                        onClick={() => onDeleteComment(post._id, comment._id)}
                                                        className="text-red-400 hover:text-red-600"
                                                        title="Delete Comment"
                                                    >
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                    </div>
                                ))}
                                {(!post.comments || post.comments.length === 0) && (
                                    <p className="text-gray-500 text-center text-sm py-2">No comments yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PostCard;