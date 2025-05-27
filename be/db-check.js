/**
 * Database connection test script
 * This file can be run independently to test the database connection
 */
require('dotenv').config();
const { sequelize } = require('./src/models');

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models with database (for development only)
    // In production, use migrations instead
    if (process.env.NODE_ENV === 'development') {
      console.log('Syncing database models...');
      await sequelize.sync({ alter: true });
      console.log('✅ Database sync complete.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

testConnection();
