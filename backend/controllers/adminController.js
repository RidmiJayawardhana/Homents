const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');
const { generateOTP, sendOTPEmail } = require('../utils/email');
const { AuditLog } = require('../models/Other');
const bcrypt = require('bcryptjs');

// @desc    Admin Login
// @route   POST /api/admin/auth/login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ $or: [{ username }, { email: username }] });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    if (!admin.isActive) return res.status(403).json({ message: 'Account deactivated' });
    
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    // 2FA - send OTP
    if (admin.twoFactorEnabled) {
      const otp = generateOTP();
      admin.otp = otp;
      admin.otpExpiry = Date.now() + 10 * 60 * 1000;
      await admin.save();
      await sendOTPEmail(admin.email, otp, 'twoFactor');
      return res.json({ requireOTP: true, adminId: admin._id, mustChangePassword: admin.mustChangePassword });
    }
    
    admin.lastLogin = Date.now();
    await admin.save();
    
    const token = generateToken(admin._id, 'admin');
    res.json({
      token, mustChangePassword: admin.mustChangePassword,
      admin: { id: admin._id, fullName: admin.fullName, email: admin.email, username: admin.username, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify admin 2FA OTP
// @route   POST /api/admin/auth/verify-2fa
const verifyAdminOTP = async (req, res) => {
  try {
    const { adminId, otp } = req.body;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (admin.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });
    
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    admin.lastLogin = Date.now();
    await admin.save();
    
    const token = generateToken(admin._id, 'admin');
    res.json({
      token, mustChangePassword: admin.mustChangePassword,
      admin: { id: admin._id, fullName: admin.fullName, email: admin.email, username: admin.username, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create support admin (super admin only)
// @route   POST /api/admin/create
const createAdmin = async (req, res) => {
  try {
    const { fullName, email, username, password, phone } = req.body;
    
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admin can create admins' });
    }
    
    const existing = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Email or username already in use' });
    
    const admin = await Admin.create({
      fullName, email, username, password, phone,
      role: 'support_admin', createdBy: req.user._id, twoFactorEnabled: true
    });
    
    await AuditLog.create({
      admin: req.user._id,
      action: 'CREATE_ADMIN',
      targetType: 'Admin',
      targetId: admin._id,
      details: { createdAdmin: username }
    });
    
    res.status(201).json({ message: 'Support Admin created successfully', admin: { id: admin._id, fullName, email, username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin change password (first login)
// @route   POST /api/admin/change-password
const changeAdminPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (admin.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });
    
    admin.password = newPassword;
    admin.mustChangePassword = false;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send password change OTP
// @route   POST /api/admin/send-change-otp
const sendChangePasswordOTP = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 10 * 60 * 1000;
    await admin.save();
    await sendOTPEmail(admin.email, otp, 'reset');
    res.json({ message: 'OTP sent to admin email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { adminLogin, verifyAdminOTP, createAdmin, changeAdminPassword, sendChangePasswordOTP };
