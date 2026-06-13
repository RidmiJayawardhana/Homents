const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        req.isAdmin = true;
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        req.isAdmin = false;
      }
      
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  } else {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Super admin only
const superAdminOnly = (req, res, next) => {
  if (!req.isAdmin || req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }
  next();
};

// Role-based middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} not authorized` });
    }
    next();
  };
};

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

module.exports = { protect, adminOnly, superAdminOnly, authorize, generateToken };
