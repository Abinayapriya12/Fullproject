const mongoose = require("mongoose");

// ✅ FIRST, define the attachment schema
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
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [attachmentSchema], // ← Now attachmentSchema is defined!
  status: {
    type: String,
    enum: ["active", "expired", "draft"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
