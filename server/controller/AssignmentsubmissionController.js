const jwt = require('jsonwebtoken')
const Assignment = require('../models/Assignment');
const Submission =require('../models/Submission ');

const User = require('../models/User');
// @route GET /api/assignments
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/assignments/:id
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'name');
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST /api/assignments (admin only)
const createAssignment = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const assignment = new Assignment({
            title,
            description,
            deadline,
            createdBy: req.user.id
        });
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT /api/assignments/:id (admin only)
const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const { title, description, deadline } = req.body;
        assignment.title = title || assignment.title;
        assignment.description = description || assignment.description;
        assignment.deadline = deadline || assignment.deadline;
        await assignment.save();
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE /api/assignments/:id (admin only)
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        await assignment.deleteOne();
        res.json({ message: 'Assignment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route POST /api/submissions (student only, file upload)
const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.body;
        const studentId = req.user.id;

        // Check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if already submitted
        const existing = await Submission.findOne({ assignment: assignmentId, student: studentId });
        if (existing) {
            return res.status(400).json({ message: 'You have already submitted this assignment' });
        }

        // Check if deadline passed
        if (new Date() > new Date(assignment.deadline)) {
            return res.status(400).json({ message: 'Submission deadline has passed' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const submission = new Submission({
            assignment: assignmentId,
            student: studentId,
            filePath: req.filepath  // or store URL if using cloud storage
        });
        await submission.save();

        res.status(201).json({ message: 'Assignment submitted successfully', submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/submissions/student/me (student sees own submissions)
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user.id })
            .populate('assignment', 'title description deadline')
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/submissions/assignment/:assignmentId (admin only)
const getSubmissionsForAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.assignmentId })
            .populate('student', 'name email')
            .populate('assignment', 'title');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT /api/submissions/:submissionId/grade (admin only)
const gradeSubmission = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // If user is NOT admin, restrict to their own submissions
    if (req.user.role !== 'admin') {
      query.student = req.user.id;
    }
    
    const submission = await Submission.findOne(query);
    
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    
    // Update fields
    submission.marks = req.body.marks;
    submission.feedback = req.body.feedback;
    submission.status = "graded";
    await submission.save();
    
    res.json({ message: "Submission graded", submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getMySubmissions,
    getSubmissionsForAssignment,
    gradeSubmission
};

