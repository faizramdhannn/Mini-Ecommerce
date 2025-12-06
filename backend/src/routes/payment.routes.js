const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Import authenticate middleware
const { authenticate } = require('../middlewares/auth');

// Validation rules
const paymentValidation = [
  body('order_id').isNumeric().withMessage('Order ID must be a number'),
  body('provider').notEmpty().withMessage('Provider is required'),
  body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  validate
];

// Routes
router.get('/', authenticate, paymentController.getAllPayments);
router.get('/:id', authenticate, paymentController.getPaymentById);
router.post('/', authenticate, paymentValidation, paymentController.createPayment);
router.put('/:id', authenticate, paymentController.updatePayment);
router.delete('/:id', authenticate, paymentController.deletePayment);

module.exports = router;