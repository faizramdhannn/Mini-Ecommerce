const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Import middlewares
const { authenticate, optionalAuth } = require('../middlewares/auth');

// Validation rules
const shipmentValidation = [
  body('order_id').isNumeric().withMessage('Order ID must be a number'),
  body('courier').notEmpty().withMessage('Courier is required'),
  body('tracking_number').notEmpty().withMessage('Tracking number is required'),
  validate
];

// Public route - track shipment
router.get('/track/:tracking_number', optionalAuth, shipmentController.trackShipment);

// Protected routes
router.get('/', authenticate, shipmentController.getAllShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
router.post('/', authenticate, shipmentValidation, shipmentController.createShipment);
router.put('/:id', authenticate, shipmentController.updateShipment);
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;