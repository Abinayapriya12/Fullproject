const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
             fileUrl: String,              // path or cloud URL
  submittedAt: { type: Date, default: Date.now },
  status: { 
          type: String, 
          enum: ['pending', 'graded', 'completed'], 
          default: 'pending' 
  },
 feedback: String,
  marks: Number
});

module.exports = mongoose.models.submission || mongoose.model("submission", submissionSchema);