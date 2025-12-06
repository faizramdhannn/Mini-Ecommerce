const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const logger = require('./src/utils/logger');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;