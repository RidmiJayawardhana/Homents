const User = require('../models/User');
const Provider = require('../models/Provider');
const { generateToken } = require('../middleware/auth');
const { generateOTP, sendOTPEmail } = require('../utils/email');

// @desc    Register new customer
// @route   POST /api/auth/register
const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password, city, address } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    
    const otp = generateOTP();
    const user = await User.create({
      fullName, email, phone, password, city, address, role: 'customer',
      otp, otpExpiry: Date.now() + 10 * 60 * 1000
    });
    
    await sendOTPEmail(email, otp, 'verification');
    res.status(201).json({ message: 'Registration successful. Check your email for OTP.', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email OTP
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    const token = generateToken(user._id, user.role);
    res.json({ message: 'Email verified successfully', token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login customer/provider
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBanned) return res.status(403).json({ message: 'Account suspended. Contact support.' });
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    user.lastLogin = Date.now();
    await user.save();
    
    let providerData = null;
    if (user.role === 'provider') {
      providerData = await Provider.findOne({ user: user._id });
    }
    
    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id, fullName: user.fullName, email: user.email,
        role: user.role, isVerified: user.isVerified, avatar: user.avatar,
        phone: user.phone, city: user.city
      },
      provider: providerData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register as service provider
// @route   POST /api/auth/register-provider
const registerProvider = async (req, res) => {
  try {
    const { fullName, email, phone, password, nic, category, skills, experience, hourlyRate, address, city, bio } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    
    const existingProvider = await Provider.findOne({ nic });
    if (existingProvider) return res.status(400).json({ message: 'NIC already registered' });
    
    const otp = generateOTP();
    const user = await User.create({
      fullName, email, phone, password, role: 'provider',
      otp, otpExpiry: Date.now() + 10 * 60 * 1000
    });
    
    await Provider.create({
      user: user._id, fullName, email, phone, nic, category,
      skills, experience, hourlyRate, address, city, bio
    });
    
    await sendOTPEmail(email, otp, 'verification');
    res.status(201).json({ message: 'Provider registration submitted. Verify email and await admin approval.', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });
    
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    await sendOTPEmail(email, otp, 'reset');
    res.json({ message: 'OTP sent to your email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });
    
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let providerData = null;
    if (user.role === 'provider') {
      providerData = await Provider.findOne({ user: user._id });
    }
    res.json({ user, provider: providerData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerCustomer, verifyOTP, loginUser, registerProvider, forgotPassword, resetPassword, getMe };
