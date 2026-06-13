const mongoose = require('mongoose');

// Review Model
const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

// Message Model
const messageSchema = new mongoose.Schema({
  chatRoom: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  image: { type: String },
  isRead: { type: Boolean, default: false },
  messageType: { type: String, enum: ['text', 'image', 'booking'], default: 'text' }
}, { timestamps: true });

// Notification Model
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'message', 'review', 'system', 'otp'], default: 'system' },
  isRead: { type: Boolean, default: false },
  link: { type: String }
}, { timestamps: true });

// Complaint Model
const complaintSchema = new mongoose.Schema({
  complainant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  against: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_review', 'resolved', 'closed'], default: 'open' },
  adminNotes: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

// Audit Log Model
const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  action: { type: String, required: true },
  targetType: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object },
  ipAddress: { type: String }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { Review, Message, Notification, Complaint, AuditLog };
