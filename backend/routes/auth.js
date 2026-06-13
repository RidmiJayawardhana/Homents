const express = require('express');
const router = express.Router();
const { registerCustomer, verifyOTP, loginUser, registerProvider, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerCustomer);
router.post('/register-provider', registerProvider);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
