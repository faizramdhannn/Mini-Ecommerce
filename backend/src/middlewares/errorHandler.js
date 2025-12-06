const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, 'Validation error', 400, errors);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'Data already exists', 409);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(res, 'Invalid reference data', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return errorResponse(res, message, statusCode);
};

// 404 handler
const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};