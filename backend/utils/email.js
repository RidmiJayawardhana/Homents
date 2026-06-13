const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const transporter = createTransporter();
  const subjects = {
    verification: 'Verify Your Email - Homents',
    reset: 'Reset Your Password - Homents',
    twoFactor: 'Two-Factor Authentication - Homents'
  };
  
  const mailOptions = {
    from: `"Homents Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjects[purpose] || 'OTP - Homents',
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px; border-radius: 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; text-align: center;">
          <h1 style="color: #0ea5e9; font-size: 28px; margin-bottom: 8px;">🏠 Homents</h1>
          <p style="color: #64748b; margin-bottom: 30px;">Your trusted home service platform</p>
          <h2 style="color: #1e293b; margin-bottom: 16px;">Your OTP Code</h2>
          <div style="background: linear-gradient(135deg, #0ea5e9, #38bdf8); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <span style="font-size: 48px; font-weight: 700; color: white; letter-spacing: 12px;">${otp}</span>
          </div>
          <p style="color: #64748b;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail };
