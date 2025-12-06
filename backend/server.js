require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./src/config/config');
const routes = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');
const orderScheduler = require('./src/schedulers/orderScheduler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start scheduler
orderScheduler.startAutoExpireOrders();

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.server.env} mode`);
  logger.info(`📍 API available at http://localhost:${PORT}/api`);
});