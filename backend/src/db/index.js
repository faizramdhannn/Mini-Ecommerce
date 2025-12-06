const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
    pool: config.database.pool,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Test koneksi
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = sequelize;