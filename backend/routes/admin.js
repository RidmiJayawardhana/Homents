const express = require('express');
const router = express.Router();
const { adminLogin, verifyAdminOTP, createAdmin, changeAdminPassword, sendChangePasswordOTP } = require('../controllers/adminController');
const { getDashboardStats, getAllUsers, toggleUserBan, getAllProviders, approveProvider, getAllBookings, getComplaints, updateComplaint, getAuditLogs } = require('../controllers/adminManageController');
const { protect, adminOnly, superAdminOnly } = require('../middleware/auth');

// Public admin routes
router.post('/auth/login', adminLogin);
router.post('/auth/verify-2fa', verifyAdminOTP);

// Protected admin routes
router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleUserBan);
router.get('/providers', getAllProviders);
router.put('/providers/:id/approve', approveProvider);
router.get('/bookings', getAllBookings);
router.get('/complaints', getComplaints);
router.put('/complaints/:id', updateComplaint);
router.get('/audit-logs', getAuditLogs);
router.post('/send-change-otp', sendChangePasswordOTP);
router.post('/change-password', changeAdminPassword);

// Super admin only
router.post('/create', superAdminOnly, createAdmin);

module.exports = router;
