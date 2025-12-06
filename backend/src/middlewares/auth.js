const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { errorResponse } = require('../utils/response');

/**
 * Middleware untuk autentikasi JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const { User } = require('../models');
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }
    
    // Attach user dengan role ke request
    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role // Include role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Middleware optional auth - tidak error jika tidak ada token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const { User } = require('../models');
    
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findByPk(decoded.userId);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        };
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

/**
 * Middleware untuk memastikan user adalah admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required', 401);
  }
  
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', 403);
  }
  
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin
};