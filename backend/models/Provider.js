const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  nic: { type: String, required: true, unique: true },
  profilePhoto: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Electrician', 'Plumber', 'Tutor', 'Cleaner', 'Mechanic', 'Carpenter', 'Painter', 'Technician', 'AC Repair', 'Garden Worker'],
    required: true
  },
  skills: { type: String },
  experience: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  address: { type: String },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  isAvailable: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  workImages: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
