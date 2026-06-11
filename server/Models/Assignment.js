const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100,
    min: [0, 'Max marks cannot be negative'],
  },
  // Changed from trainerId to createdBy to match your existing controller
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [attachmentSchema],
  status: {
    type: String,
    enum: ["active", "expired", "draft"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: track which students have submitted
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
  }],
});

module.exports = mongoose.model("Assignment", assignmentSchema);
