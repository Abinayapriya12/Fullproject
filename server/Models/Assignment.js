const mongoose= require("mongoose")

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,               // submissions after this are not allowed
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports =mongoose.model("Assignment",assignmentSchema)
