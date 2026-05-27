const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
         }
});


const sendEmail = async (email, otp) => {
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset OTP',
    html: `<h3>Your OTP: <strong>${otp}</strong></h3><p>Valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.</p>`
  });
};

module.exports={sendEmail}