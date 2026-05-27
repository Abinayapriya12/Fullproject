const userController = require("../controller/userController")
const resetpassController =require("../controller/resetpassController")
const verifyToken = require("../controller/userController")
const express = require("express");
const user = require("../Models/user");
const router = express.Router();
const {login}=require('../controller/userController')
const { forgotPassword, verifyOtp, resetPassword}=require('../controller/resetpassController')

router.post("/user-register", userController.register)
router.post("/user-login",userController.login)
router.post("/books",userController.verifyToken,userController.createUser)
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

router.get('/profile', userController.verifyToken,userController.profileupdate)

module.exports=router
