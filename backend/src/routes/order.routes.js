const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be an array with at least one item'),
  body('items.*.product_id').isNumeric().withMessage('Product ID must be a number'),
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number').custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  body('payment_method').notEmpty().withMessage('Payment method is required'),
  body('shipping_cost').optional().isNumeric().withMessage('Shipping cost must be a number'),
  validate
];

const updateStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELED'])
    .withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validate
];

const paymentValidation = [
  body('provider').notEmpty().withMessage('Provider is required'),
  body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
  validate
];

const shipmentValidation = [
  body('courier').notEmpty().withMessage('Courier is required'),
  body('tracking_number').notEmpty().withMessage('Tracking number is required'),
  validate
];

const shipmentStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(['WAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'])
    .withMessage('Invalid shipment status'),
  validate
];

const cancelOrderValidation = [
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validate
];

// SEMUA routes memerlukan authentication
// Admin akan mendapat akses penuh, user hanya melihat data mereka
router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, createOrderValidation, orderController.createOrder);

// Order status management
router.patch('/:id/status', authenticate, updateStatusValidation, orderController.updateOrderStatus);
router.patch('/:id/complete', authenticate, orderController.completeOrder);
router.patch('/:id/cancel', authenticate, cancelOrderValidation, orderController.cancelOrder);

// Payment routes
router.post('/:id/payment', authenticate, paymentValidation, orderController.createPayment);

// Shipment routes
router.post('/:id/shipment', authenticate, shipmentValidation, orderController.createShipment);
router.patch('/:id/shipment/status', authenticate, shipmentStatusValidation, orderController.updateShipmentStatus);

module.exports = router;