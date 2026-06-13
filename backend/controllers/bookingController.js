const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { Notification } = require('../models/Other');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { providerId, service, description, scheduledDate, scheduledTime, address, amount } = req.body;
    
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    if (!provider.isAvailable) return res.status(400).json({ message: 'Provider not available' });
    
    const booking = await Booking.create({
      customer: req.user._id,
      provider: providerId,
      service, description, scheduledDate, scheduledTime, address, amount
    });
    
    // Create notification for provider
    await Notification.create({
      user: provider.user,
      title: 'New Booking Request',
      message: `You have a new booking request for ${service}`,
      type: 'booking',
      link: `/provider/bookings/${booking._id}`
    });
    
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate({ path: 'provider', select: 'fullName category profilePhoto rating city' })
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider bookings
// @route   GET /api/bookings/provider
const getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    
    const bookings = await Booking.find({ provider: provider._id })
      .populate('customer', 'fullName avatar phone')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('provider');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = status;
    if (cancelReason) booking.cancelReason = cancelReason;
    if (status === 'completed') {
      booking.completedAt = Date.now();
      const provider = await Provider.findById(booking.provider._id);
      provider.completedJobs += 1;
      provider.totalEarnings += booking.amount;
      await provider.save();
    }
    
    await booking.save();
    
    await Notification.create({
      user: booking.customer,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking has been ${status}`,
      type: 'booking'
    });
    
    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking (customer)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!['pending', 'accepted'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }
    
    booking.status = 'cancelled';
    booking.cancelReason = req.body.reason || 'Cancelled by customer';
    await booking.save();
    
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getProviderBookings, updateBookingStatus, cancelBooking };
