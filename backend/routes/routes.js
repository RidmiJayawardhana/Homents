const express = require('express');
const providerRouter = express.Router();
const bookingRouter = express.Router();
const { getProviders, getProvider, updateProviderProfile, updateAvailability, getProviderDashboard } = require('../controllers/providerController');
const { createBooking, getMyBookings, getProviderBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { Review, Notification, Complaint } = require('../models/Other');

// Provider routes
providerRouter.get('/', getProviders);
providerRouter.get('/dashboard', protect, authorize('provider'), getProviderDashboard);
providerRouter.get('/:id', getProvider);
providerRouter.put('/profile', protect, authorize('provider'), updateProviderProfile);
providerRouter.put('/availability', protect, authorize('provider'), updateAvailability);

// Booking routes
bookingRouter.post('/', protect, authorize('customer'), createBooking);
bookingRouter.get('/my', protect, getMyBookings);
bookingRouter.get('/provider', protect, authorize('provider'), getProviderBookings);
bookingRouter.put('/:id/status', protect, authorize('provider'), updateBookingStatus);
bookingRouter.put('/:id/cancel', protect, authorize('customer'), cancelBooking);

// Review routes
providerRouter.post('/:id/review', protect, authorize('customer'), async (req, res) => {
  try {
    const review = await Review.create({
      customer: req.user._id,
      provider: req.params.id,
      booking: req.body.bookingId,
      rating: req.body.rating,
      comment: req.body.comment
    });
    
    const provider = require('../models/Provider');
    const allReviews = await Review.find({ provider: req.params.id });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await provider.findByIdAndUpdate(req.params.id, { rating: avgRating.toFixed(1), totalReviews: allReviews.length });
    
    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Notifications
const notifRouter = express.Router();
notifRouter.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ notifications });
});
notifRouter.put('/:id/read', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
});

// Complaints
const complaintRouter = express.Router();
complaintRouter.post('/', protect, async (req, res) => {
  try {
    const complaint = await Complaint.create({ complainant: req.user._id, ...req.body });
    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User profile update
const userRouter = express.Router();
userRouter.put('/profile', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.put('/favorites/:providerId', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const idx = user.favorites.indexOf(req.params.providerId);
    if (idx === -1) user.favorites.push(req.params.providerId);
    else user.favorites.splice(idx, 1);
    await user.save();
    res.json({ message: 'Favorites updated', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.get('/favorites', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { providerRouter, bookingRouter, notifRouter, complaintRouter, userRouter };
