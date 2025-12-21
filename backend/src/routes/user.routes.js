const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const addressValidation = [
  body('recipient_name').notEmpty().withMessage('Recipient name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('address_line').notEmpty().withMessage('Address line is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('province').notEmpty().withMessage('Province is required'),
  validate
];

// Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// ⭐ NEW: Membership endpoint
router.get('/me/membership', authenticate, userController.getMembershipInfo);

// Address routes
router.get('/:id/addresses', userController.getUserAddresses);
router.post('/:id/addresses', addressValidation, userController.addUserAddress);
router.put('/:id/addresses/:addressId', addressValidation, userController.updateUserAddress);
router.delete('/:id/addresses/:addressId', userController.deleteUserAddress);

module.exports = router;