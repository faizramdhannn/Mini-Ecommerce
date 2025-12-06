const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const addItemValidation = [
  body('product_id').isNumeric().withMessage('Product ID must be a number'),
  body('quantity').isNumeric().withMessage('Quantity must be a number').custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  validate
];

const updateItemValidation = [
  body('quantity').isNumeric().withMessage('Quantity must be a number').custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  validate
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', cartController.getCart);
router.post('/items', addItemValidation, cartController.addItem);
router.put('/items/:id', updateItemValidation, cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;