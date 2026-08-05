const User = require("../Models/user");
const books = require("../Models/books");
const studentsdata = require("../Models/studentsdata");
const Student = require("../Models/Student"); 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY;
const nodemailer = require("nodemailer")
const { sendEmail } = require("../helper/sendEmail")
const middleware = require('../middleware/Auth')
const adminMiddleware = require('../middleware/Admin')
const mongoose = require('mongoose'); 
// register function with student pre-registration validation

const register = async (req, res) => {
    try {
        const { username, password, email, gender, mobile, age,role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        
        // Create user – password is plain text here, schema will hash it
        const user = new User({ username, password, email, gender, mobile, age,role });
        await user.save();  // pre('save') hashes password once
        
        res.status(201).json({ success: true, message: "Registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
// Login function (keep as is, works with both students and admins)

const login = async (req, res) => {
    try {
        const { username, password} = req.body;
        
        // IMPORTANT: .select('+password') to include password field
        const user = await User.findOne({ username }).select('+password');
        
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "invalid password" });
        }
        
        // Generate token (optional)
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role  }, process.env.SECRET_KEY, { expiresIn: '7d' });
        console.log("User role from DB:", user.role);
        res.status(200).json({
            success: true,
            message: "Login successful",
            role: user.role,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
// ADMIN FUNCTIONS FOR MANAGING PRE-REGISTERED STUDENTS

// Admin: Add new student to pre-registration database
const addPreRegisteredStudent = async (req, res) => {
    try {
        const { studentId, username, email, gender, mobile, age, enrollmentYear, department } = req.body;

        // Check if student already exists in pre-registration
        const existingStudent = await Student.findOne({ 
            $or: [{ studentId }, { email }, { username }] 
        });
        
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Student with this ID, email, or username already exists in pre-registration" 
            });
        }

        // Check if user already registered in User collection
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                message: "This student already has a registered account" 
            });
        }

        const student = new Student({
            studentId,
            username,
            email,
            gender,
            mobile,
            age: parseInt(age),
            enrollmentYear: parseInt(enrollmentYear),
            department,
            isRegistered: false
        });

        await student.save();
        
        res.status(201).json({ 
            success: true,
            message: "Student added to pre-registration successfully", 
            student 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all pre-registered students
const getAllPreRegisteredStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true,
            data: students 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get unregistered students (students who haven't registered yet)
const getUnregisteredStudents = async (req, res) => {
    try {
        const students = await Student.find({ isRegistered: false }).sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true,
            data: students 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get registered students (students who have created accounts)
const getRegisteredStudents = async (req, res) => {
    try {
        const registeredUsers = await User.find({ role: 'student' }).select('-password');
        // Optionally, you can join with pre-registration data
        const studentsWithDetails = await Promise.all(
            registeredUsers.map(async (user) => {
                const preRegData = await Student.findOne({ email: user.email });
                return {
                    ...user.toObject(),
                    preRegistrationDetails: preRegData
                };
            })
        );
        
        res.status(200).json({ 
            success: true,
            data: studentsWithDetails 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete pre-registered student
const deletePreRegisteredStudent = async (req, res) => {
    try {
        const { id } = req.params;
        
        let student;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        if (isValidObjectId && id.length === 24) {
            student = await Student.findById(id);
        } else {
            student = await Student.findOne({ studentId: id });
        }
        
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: "Student not found in pre-registration" 
            });
        }

        const studentInfo = {
            studentId: student.studentId,
            username: student.username,
            email: student.email,
            wasRegistered: student.isRegistered
        };
        
        if (student.isRegistered) {
            await User.findOneAndDelete({ 
                $or: [
                    { studentId: student.studentId },
                    { email: student.email },
                    { username: student.username }
                ]
            });
        } 
        
        await Student.findByIdAndDelete(student._id);
        
        res.status(200).json({ 
            success: true,
            message: student.isRegistered 
                ? "Student deleted from pre-registration and user account removed successfully" 
                : "Pre-registered student deleted successfully",
            data: studentInfo
        });
        
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Admin: Update pre-registered student details
const updatePreRegisteredStudent = async (req, res) => {
    try {
        const { studentId, username, email, gender, mobile, age, enrollmentYear, department } = req.body;
        
        // Check if already registered
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.email === email) {
            return res.status(400).json({ 
                message: "Cannot update - this student has already registered an account" 
            });
        }
        
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                studentId,
                username,
                email,
                gender,
                mobile,
                age: parseInt(age),
                enrollmentYear: parseInt(enrollmentYear),
                department
            },
            { new: true, runValidators: true }
        );
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.status(200).json({ 
            success: true,
            message: "Pre-registered student updated successfully",
            student 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const verifystudent = async (req, res) => {
  try {
    const { studentId, email, mobile } = req.body;
    
    const student = await Student.findOne({
      studentId: studentId,
      email: email,
      mobile: mobile,
      isRegistered: false
    });
    
    if (student) {
      return res.json({ exists: true, message: "Student verified" });
    } else {
      return res.json({ exists: false, message: "Student not found in records" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ exists: false, message: "Verification failed" });
  }
};

const createUser = async (req, res) => {
    try {
        const { title, author, category, publishedyear } = req.body;
        const user = await books.create({
            title: title,
            author: author,
            category: category,
            publishedyear: publishedyear
        })
        res.status(201).json({ message: "user created successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const viewAllbooks = async (req, res) => {
    try {
        const User = await books.find();
        res.status(200).json({ data: User })
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}

const deletebook = async (req, res) => {
    try {
        const user = await books.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const updatebook = async (req, res) => {
    try {
        const { title, author, category, publishedyear } = req.body
        const user = await books.findByIdAndUpdate(req.params.id, { title, author, category, publishedyear })
        res.status(200).json({ message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const createData = async (req, res) => {
    try {
        const { name, email, age, course, grade } = req.body;
        const user = await studentsdata.create({ name: name, email: email, age: age, course: course, grade: grade })
        res.status(201).json({ message: "user created successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const viewStudentdetails = async (req, res) => {
    try {
        const User = await studentsdata.find();
        res.status(200).json({ data: User })
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}

const deletestudentdetails = async (req, res) => {
    try {
        const user = await studentsdata.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const updatestudents = async (req, res) => {
    try {
        const { name, email, age, course, grade } = req.body
        const user = await studentsdata.findByIdAndUpdate(req.params.id, {
            name, email, age, course, grade
        })
        res.status(200).json({ message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const updateUser = async (id, updates) => {
    return await User.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
};

const profileupdate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    register,
    login,
    createUser,
    viewAllbooks,
    deletebook,
    updatebook,
    createData,
    viewStudentdetails,
    deletestudentdetails,
    updatestudents,
    findUserByEmail,
    updateUser,
    profileupdate,
  
    addPreRegisteredStudent,
    getAllPreRegisteredStudents,
    getUnregisteredStudents,
    getRegisteredStudents,
    deletePreRegisteredStudent,
    updatePreRegisteredStudent,
    verifystudent
};