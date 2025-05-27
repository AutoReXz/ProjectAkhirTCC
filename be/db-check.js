/**
 * Database connection test script
 * This file can be run independently to test the database connection
 */
require('dotenv').config();
const { sequelize } = require('./src/models');

const testConnection = async () => {
  try {
    console.log('🔍 Database Configuration:');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    console.log('Dialect:', process.env.DB_DIALECT || 'mysql');
    console.log('Password:', process.env.DB_PASS ? '[SET]' : '[NOT SET]');
    
    console.log('\n🔗 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test simple query
    const [results] = await sequelize.query('SELECT 1 as test');
    console.log('✅ Database query test successful:', results);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    process.exit(1);
  }
};

testConnection();
