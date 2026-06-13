const Provider = require('../models/Provider');
const User = require('../models/User');
const { Review } = require('../models/Other');

// @desc    Get all approved providers
// @route   GET /api/providers
const getProviders = async (req, res) => {
  try {
    const { category, city, minRating, isAvailable, search, sort } = req.query;
    let query = { isApproved: true, isActive: true };
    
    if (category) query.category = category;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (isAvailable === 'true') query.isAvailable = true;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortObj = { createdAt: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'price') sortObj = { hourlyRate: 1 };
    if (sort === 'experience') sortObj = { experience: -1 };
    
    const providers = await Provider.find(query).sort(sortObj).populate('user', 'fullName avatar');
    res.json({ providers, count: providers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single provider
// @route   GET /api/providers/:id
const getProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('user', 'fullName avatar email');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    
    const reviews = await Review.find({ provider: provider._id, isVisible: true })
      .populate('customer', 'fullName avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ provider, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider profile
// @route   PUT /api/providers/profile
const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: 'Provider profile not found' });
    
    const updates = req.body;
    Object.assign(provider, updates);
    await provider.save();
    
    res.json({ message: 'Profile updated', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update availability
// @route   PUT /api/providers/availability
const updateAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    res.json({ message: 'Availability updated', isAvailable: provider.isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider dashboard stats
// @route   GET /api/providers/dashboard
const getProviderDashboard = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    
    const Booking = require('../models/Booking');
    const totalBookings = await Booking.countDocuments({ provider: provider._id });
    const pendingBookings = await Booking.countDocuments({ provider: provider._id, status: 'pending' });
    const completedBookings = await Booking.countDocuments({ provider: provider._id, status: 'completed' });
    const recentBookings = await Booking.find({ provider: provider._id })
      .populate('customer', 'fullName avatar')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({ provider, stats: { totalBookings, pendingBookings, completedBookings, totalEarnings: provider.totalEarnings, rating: provider.rating, totalReviews: provider.totalReviews }, recentBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProviders, getProvider, updateProviderProfile, updateAvailability, getProviderDashboard };
