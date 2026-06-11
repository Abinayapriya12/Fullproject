const upload =require("../middleware/upload")
const userController = require("../controller/userController")
const resetpassController =require("../controller/resetpassController")
const AssignmentsubmissionController =require('../controller/AssignmentsubmissionController')
const {verifyToken} = require("../middleware/Auth")
const adminMiddleware =require ("../middleware/Admin")
const jwt = require('jsonwebtoken')
const express = require("express");
const user = require("../Models/user");
const router = express.Router();
const {login}=require('../controller/userController')
const { forgotPassword, verifyOtp, resetPassword}=require('../controller/resetpassController')
const Submission = require('../models/Submission ')
const getUsers = require('../controller/userController')
const discussionController =require ('../controller/discussionController');

// ========== EXISTING AUTH ROUTES ==========
router.post("/user-register", userController.register)
router.post("/user-login",userController.login)

// ========== STUDENT MANAGEMENT ROUTES ==========
router.post("/addstudents",userController.addPreRegisteredStudent);//token
router.get("/allstudents",userController.getAllPreRegisteredStudents);//token
router.get("/unregistered",userController.getUnregisteredStudents);//token
router.get("/registered",userController.getRegisteredStudents);//token
router.delete("/deleteregistered/:id",userController.deletePreRegisteredStudent);// token
router.put("/updatepreregistered/:id",userController.updatePreRegisteredStudent);//token

// ========== BOOK ROUTES ==========
router.post("/books",verifyToken,userController.createUser)
router.get("/getbooks",userController.viewAllbooks)
router.delete("/deletebook/:id",userController.deletebook)
router.put("/updatebook/:id",userController.updatebook)
// ========== STUDENT DETAILS ROUTES ==========
router.post("/students", userController.createData)
router.get("/students", userController.viewStudentdetails)
router.delete("/students/:id",userController.deletestudentdetails)
router.put("/students/:id",userController.updatestudents) 
// ========== PASSWORD RESET ROUTES ==========
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// ========== ASSIGNMENT ROUTES ==========
router.post("/assignments",verifyToken,AssignmentsubmissionController.createAssignment)

router.get("/assignments",AssignmentsubmissionController.getAssignments) //students
router.get("/assignments/:id",AssignmentsubmissionController.getAssignmentById)// 
router.put("/assignments/:id",AssignmentsubmissionController.updateAssignment)// admin
router.delete("/assignments/:id",AssignmentsubmissionController.deleteAssignment)// admin

router.post('/submissions',verifyToken,upload.single('submission'),AssignmentsubmissionController.submitAssignment);//student 

router.get("/submissions",verifyToken,AssignmentsubmissionController.getMySubmissions)//student
router.get("/submissions/:id",AssignmentsubmissionController.getSubmissionsForAssignment)//student
router.put("/submissions/:id",verifyToken,AssignmentsubmissionController.gradeSubmission)//admin
router.get("/allsubmissions", verifyToken, AssignmentsubmissionController.getAllSubmissions);// admin

router.get('/posts', verifyToken, discussionController.getAllPosts);
router.get('/posts/:id', verifyToken, discussionController.getPostById);

// ========== DISCUSSION FORUM ROUTES ==========
    
router.post('/posts', verifyToken, discussionController.createPost);
router.put('/posts/:id', verifyToken, discussionController.updatePost);
router.delete('/posts/:id', verifyToken, discussionController.deletePost);
router.post('/posts/:id/like', verifyToken, discussionController.toggleLike);
router.post('/posts/:id/comments', verifyToken, discussionController.addComment);
router.delete('/posts/:postId/comments/:commentId', verifyToken, discussionController.deleteComment);
router.get('/my-posts', verifyToken, discussionController.getMyPosts);

// Admin only routes
router.patch('/posts/:id/pin', verifyToken, adminMiddleware, discussionController.togglePin);
// ========== DISCUSSION FORUM ROUTES ==========
if (discussionController) {
    
    // GET all posts
    router.get("/discussions/posts", verifyToken, (req, res) => {
        discussionController.getAllPosts(req, res);
    });
    
    // GET single post
    router.get("/discussions/posts/:id", verifyToken, (req, res) => {
        discussionController.getPostById(req, res);
    });
    
    // CREATE post
    router.post("/discussions/posts", verifyToken, (req, res) => {
        discussionController.createPost(req, res);
    });
    
    // UPDATE post
    router.put("/discussions/posts/:id", verifyToken, (req, res) => {
        discussionController.updatePost(req, res);
    });
    
    // DELETE post
    router.delete("/discussions/posts/:id", verifyToken, (req, res) => {
        discussionController.deletePost(req, res);
    });
    
    // LIKE post
    router.post("/discussions/posts/:id/like", verifyToken, (req, res) => {
        discussionController.toggleLike(req, res);
    });
    
    // ADD COMMENT
    router.post("/discussions/posts/:id/comments", verifyToken, (req, res) => {
        discussionController.addComment(req, res);
    });
    
    // DELETE COMMENT
    router.delete("/discussions/posts/:postId/comments/:commentId", verifyToken, (req, res) => {
        discussionController.deleteComment(req, res);
    });
    
    // GET MY POSTS
    router.get("/discussions/my-posts", verifyToken, (req, res) => {
        discussionController.getMyPosts(req, res);
    });
    
    // PIN post (admin only)
    router.patch("/discussions/posts/:id/pin", verifyToken, (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    }, (req, res) => {
        discussionController.togglePin(req, res);
    });

} else {
    console.error('controller missing');
}
module.exports=router
   