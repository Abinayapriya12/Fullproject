const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please Enter your username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter valid password"],
        select: false
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    gender: String,
    mobile: String,
    age: Number,
   role: { type: String, 
          enum: ['student', 'admin']},
    resetToken: String,
    resetExpires: Date
});

// Hash password before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
