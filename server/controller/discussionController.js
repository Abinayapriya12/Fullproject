const DiscussionPost = require('../models/DiscussionPost');

// Create a new post (Student only)
// Create a new post (Student only)
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        console.log('Create post request - user:', req.user);
        console.log('Create post request - body:', { title, content });
        
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        // Get user ID from token
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        // Get author name - fetch from database if not in token
        let authorName = 'User';
        let authorRole = req.user.role || 'student';
        
        // If user has name/username in token, use it
        if (req.user.name) {
            authorName = req.user.name;
        } else if (req.user.username) {
            authorName = req.user.username;
        } else if (req.user.email) {
            authorName = req.user.email.split('@')[0];
        } else {
            // Try to fetch user from database to get the username
            try {
                const User = require('../Models/user');
                const userFromDb = await User.findById(userId);
                if (userFromDb) {
                    authorName = userFromDb.username || userFromDb.email || 'User';
                    authorRole = userFromDb.role || 'student';
                }
            } catch (err) {
                console.log('Could not fetch user from DB:', err.message);
            }
        }
        
        const postData = {
            title: title,
            content: content,
            author: userId,
            authorName: authorName,
            authorRole: authorRole
        };
        
        console.log('Creating post with data:', postData);
        
        const post = new DiscussionPost(postData);
        await post.save();
        
        console.log('Post created successfully:', post._id);
        
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        console.error('Error details:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error creating post",
            error: error.message
        });
    }
};

// Get all posts (with pagination, filtering, sorting)
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        let query = { isDeleted: false };
        
        // Search functionality
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }
        
        // Filter by author
        if (req.query.authorId) {
            query.author = req.query.authorId;
        }

        const posts = await DiscussionPost.find(query)
            .sort({ isPinned: -1, [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate('author', 'name email role')
            .populate('comments.author', 'name email role');

        const total = await DiscussionPost.countDocuments(query);

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        });
    }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await DiscussionPost.findById(req.params.id)
            .populate('author', 'name email role')
            .populate('comments.author', 'name email role');

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching post",
            error: error.message
        });
    }
};

// Update post (Author only)
exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await DiscussionPost.findById(req.params.id);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user is author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts"
            });
        }

        if (title) post.title = title;
        if (content) post.content = content;

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating post",
            error: error.message
        });
    }
};

// Delete post (Author or Admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await DiscussionPost.findById(req.params.id);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user is author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts"
            });
        }

        post.isDeleted = true;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting post",
            error: error.message
        });
    }
};

// Like/Unlike post
exports.toggleLike = async (req, res) => {
    try {
        const post = await DiscussionPost.findById(req.params.id);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Like the post
            post.likes.push(userId);
            post.likesCount += 1;
        } else {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
            post.likesCount -= 1;
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: likeIndex === -1 ? "Post liked" : "Post unliked",
            likesCount: post.likesCount,
            isLiked: likeIndex === -1
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error toggling like",
            error: error.message
        });
    }
};

// Add comment to post
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        const post = await DiscussionPost.findById(req.params.id);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = {
            content: content.trim(),
            author: req.user.id,
            authorName: req.user.name || req.user.email
        };

        post.comments.push(comment);
        await post.save();

        // Get the populated comment
        const updatedPost = await DiscussionPost.findById(req.params.id)
            .populate('comments.author', 'name email role');

        const newComment = updatedPost.comments[updatedPost.comments.length - 1];

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        });
    }
};

// Delete comment (Author or Admin)
exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await DiscussionPost.findById(postId);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = post.comments.id(commentId);
        
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Check if user is comment author or admin
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

        comment.remove();
        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error: error.message
        });
    }
};

// Pin/Unpin post (Admin only)
exports.togglePin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only admin can pin posts"
            });
        }

        const post = await DiscussionPost.findById(req.params.id);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        post.isPinned = !post.isPinned;
        await post.save();

        res.status(200).json({
            success: true,
            message: post.isPinned ? "Post pinned" : "Post unpinned",
            isPinned: post.isPinned
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error toggling pin",
            error: error.message
        });
    }
};

// Get user's own posts
exports.getMyPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await DiscussionPost.find({ 
            author: req.user.id, 
            isDeleted: false 
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email role');

        const total = await DiscussionPost.countDocuments({ 
            author: req.user.id, 
            isDeleted: false 
        });

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching your posts",
            error: error.message
        });
    }
};