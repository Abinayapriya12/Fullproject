const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true,'student id is required'],
    unique: true,
    match: [/^STU\d{7}$/,'Student ID must be in format: STU followed by 7 digits']
  },
  username: {
    type: [String,'Username is required'],
    required: true,
    unique: true,
    minlength:[3,'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true,'email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    lowercase:true, 
    unique: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  mobile: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  enrollmentYear: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    enum:[
        'Computer Science',
        'Mechanical Engineering',
        'Electrical Engineering',
        'Civil Engineering',
        'Electronics Engineering',
        'Electronics Engineering',
        'Information Technology'],
    message: 'Please select a valid department from the list',
    required: true
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);