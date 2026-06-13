const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const { Review, Complaint, AuditLog } = require('../models/Other');

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const approvedProviders = await Provider.countDocuments({ isApproved: true });
    const pendingProviders = await Provider.countDocuments({ isApproved: false });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in_progress'] } });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'open' });

    // Monthly data for charts
    const monthlyUsers = await User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Category distribution
    const categoryStats = await Provider.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity
    const recentBookings = await Booking.find()
      .populate('customer', 'fullName')
      .populate('provider', 'fullName category')
      .sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: { totalUsers, totalProviders, approvedProviders, pendingProviders, totalBookings, activeBookings, completedBookings, totalComplaints, openComplaints },
      monthlyUsers, categoryStats, recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    
    const users = await User.find(query).select('-password')
      .sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user ban
// @route   PUT /api/admin/users/:id/ban
const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBanned = !user.isBanned;
    await user.save();
    
    await AuditLog.create({
      admin: req.user._id,
      action: user.isBanned ? 'BAN_USER' : 'UNBAN_USER',
      targetType: 'User', targetId: user._id,
      details: { email: user.email }
    });
    
    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, isBanned: user.isBanned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all providers (admin)
// @route   GET /api/admin/providers
const getAllProviders = async (req, res) => {
  try {
    const { isApproved, category, search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (category) query.category = category;
    if (search) query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    
    const providers = await Provider.find(query)
      .populate('user', 'fullName email avatar isVerified isBanned')
      .sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await Provider.countDocuments(query);
    res.json({ providers, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/reject provider
// @route   PUT /api/admin/providers/:id/approve
const approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true }
    );
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    
    await AuditLog.create({
      admin: req.user._id,
      action: req.body.isApproved ? 'APPROVE_PROVIDER' : 'REJECT_PROVIDER',
      targetType: 'Provider', targetId: provider._id,
      details: { name: provider.fullName, category: provider.category }
    });
    
    res.json({ message: `Provider ${req.body.isApproved ? 'approved' : 'rejected'}`, provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const bookings = await Booking.find(query)
      .populate('customer', 'fullName email')
      .populate({ path: 'provider', select: 'fullName category' })
      .sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await Booking.countDocuments(query);
    res.json({ bookings, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints
// @route   GET /api/admin/complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('complainant', 'fullName email')
      .sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/admin/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, adminNotes: req.body.adminNotes, resolvedAt: req.body.status === 'resolved' ? Date.now() : undefined },
      { new: true }
    );
    res.json({ message: 'Complaint updated', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('admin', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleUserBan, getAllProviders, approveProvider, getAllBookings, getComplaints, updateComplaint, getAuditLogs };
