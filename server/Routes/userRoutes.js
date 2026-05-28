const userController = require("../controller/userController")
const resetpassController =require("../controller/resetpassController")
const AssignmentsubmissionController =require('../controller/AssignmentsubmissionController')
const {verifyToken} = require("../middleware/Auth")
const jwt = require('jsonwebtoken')
const express = require("express");
const user = require("../Models/user");
const router = express.Router();
const {login}=require('../controller/userController')
const { forgotPassword, verifyOtp, resetPassword}=require('../controller/resetpassController')

router.post("/user-register", userController.register)
router.post("/user-login",userController.login)
router.post("/books",verifyToken,userController.createUser)
router.get("/getbooks",userController.viewAllbooks)
router.delete("/deletebook/:id",userController.deletebook)
router.put("/updatebook/:id",userController.updatebook)

router.post("/students", userController.createData)
router.get("/students", userController.viewStudentdetails)
router.delete("/students/:id",userController.deletestudentdetails)
router.put("/students/:id",userController.updatestudents) 

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.post("/assignments",verifyToken,AssignmentsubmissionController.createAssignment)

router.get("/assignments",AssignmentsubmissionController.getAssignments)
router.get("/assignments/:id",AssignmentsubmissionController.getAssignmentById)
router.put("/assignments/:id",AssignmentsubmissionController.updateAssignment)
router.delete("/assignments/:id",AssignmentsubmissionController.deleteAssignment)

router.post("/submissions",verifyToken,AssignmentsubmissionController.submitAssignment)

router.get("/submissions",AssignmentsubmissionController.getMySubmissions)
router.get("/submissions/:id",AssignmentsubmissionController.getSubmissionsForAssignment)
router.put("/submissions/:id",AssignmentsubmissionController.gradeSubmission)

module.exports=router
