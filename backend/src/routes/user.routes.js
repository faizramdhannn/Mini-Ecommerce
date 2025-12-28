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

// ⭐ PENTING: Semua routes di sini HARUS protected dengan authenticate
// Karena semua operasi user/address membutuhkan login

// Routes
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

// ⭐ NEW: Membership endpoint
router.get('/me/membership', authenticate, userController.getMembershipInfo);

// ⭐ FIX: Address routes - TAMBAHKAN authenticate middleware
router.get('/:id/addresses', authenticate, userController.getUserAddresses);
router.post('/:id/addresses', authenticate, addressValidation, userController.addUserAddress);
router.put('/:id/addresses/:addressId', authenticate, addressValidation, userController.updateUserAddress);
router.delete('/:id/addresses/:addressId', authenticate, userController.deleteUserAddress);

module.exports = router;