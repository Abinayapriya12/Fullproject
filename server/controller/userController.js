const User = require("../Models/user");
const books = require("../Models/books");
const studentsdata = require("../Models/studentsdata");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY;
const nodemailer = require("nodemailer")
const { sendEmail } = require("../helper/sendEmail")

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
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '7d' });
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
const users = [
  { 
    id: 1,
    email: 'user@example.com', 
    passwordHash: '$2b$10$...',
    resetToken: null, 
    resetExpires: null 
},
{
    id:"6a1529521b2818fc1eadaaf6",
    email:"priyakabinaya@gmail.com",
    passwordHash:"$2b$10$66ScmPacGAQcsQHFLOCfGOVvnZmVL5im36PG6jp5fFpHCjIDlnEz2",
    resetToken: null,
    resetExpires: null 
}
];

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUser = async (id, updates) => {
  return await User.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
};

 const profileupdate = async(req,res)=>{

    try{

        const user = await User.findById(req.user.id)
        .select("-password")

        res.status(200).json(user)

    }catch(error){

        res.status(500).json({
            message:error.message
        })

    }

}
 


module.exports = { register, 
    login,  
     createUser, 
    viewAllbooks, 
    deletebook, 
    updatebook, 
    createData, 
    viewStudentdetails, 
    deletestudentdetails, 
    updatestudents , 
    findUserByEmail, 
    updateUser,
    profileupdate};

