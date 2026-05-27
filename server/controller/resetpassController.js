 const User = require('../Models/user'); // adjust path if needed
const crypto = require('crypto');
const {login}= require ('../controller/userController')
const { sendEmail } = require("../helper/sendEmail")
// For development, just log OTP to console. For production, use nodemailer.
const sendOTPByEmail = (email, otp) => {
    console.log(`OTP for ${email}: ${otp}`);
    // TODO: integrate nodemailer to send real email
};

// 1. Forgot password – generate OTP and store token
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Generate 6‑digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        // Hash the OTP before storing (more secure)
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        user.resetToken = hashedOTP;
        user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send OTP via email (log to console for development)
        sendOTPByEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetToken: hashedOTP,
            resetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 3. Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all password fields' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (newPassword.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters' });
        }

        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetToken: hashedOTP,
            resetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Set new password (will be hashed by pre‑save hook)
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Login successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { forgotPassword, verifyOtp, resetPassword }; 