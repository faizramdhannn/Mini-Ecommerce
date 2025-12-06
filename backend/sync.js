const sequelize = require('./db');
const logger = require('./src/utils/logger');

// Import models untuk memastikan relasi terdefinisi
require('./models');

/**
 * Script untuk sinkronisasi database
 * Opsi:
 * - force: true -> DROP semua tabel dan buat ulang (HATI-HATI!)
 * - alter: true -> Ubah tabel sesuai model tanpa hapus data
 */

const syncDatabase = async () => {
  try {
    logger.info('Starting database synchronization...');
    
    // Pilih salah satu:
    
    // Option 1: Alter tables (recommended untuk development)
    // await sequelize.sync({ alter: true });
    // logger.info('✅ Database synchronized successfully with ALTER mode');
    
    // Option 2: Force sync (DANGER: akan hapus semua data!)
    await sequelize.sync({ force: true });
    logger.info('✅ Database synchronized successfully with FORCE mode');
    
    // Option 3: Hanya cek tanpa perubahan
    // await sequelize.sync();
    // logger.info('✅ Database synchronized successfully');
    
    logger.info('All tables have been created/updated');
    
    // Close connection
    await sequelize.close();
    logger.info('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

// Run sync
syncDatabase();