const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const config = require('../config/config');

class AuthController {
  /**
   * Register user baru - HANYA nickname, email, password
   */
  async register(req, res, next) {
    try {
      const { nickname, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, 'Email already registered', 409);
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user - default role is 'user'
      const user = await User.create({
        nickname,
        email,
        password: hashedPassword,
        role: 'user'
      });
      
      // Generate token with role
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      return successResponse(res, {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          role: user.role
        }
      }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, 'Invalid email or password', 401);
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return errorResponse(res, 'Invalid email or password', 401);
      }
      
      // Generate token with role
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      return successResponse(res, {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role
        }
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res, next) {
    try {
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get profile user yang sedang login
   */
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      
      return successResponse(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update password
   */
  async updatePassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;
      
      const user = await User.findByPk(req.user.id);
      
      // Verify old password
      const isValidPassword = await bcrypt.compare(old_password, user.password);
      if (!isValidPassword) {
        return errorResponse(res, 'Invalid old password', 400);
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      
      // Update password
      await user.update({ password: hashedPassword });
      
      return successResponse(res, null, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();