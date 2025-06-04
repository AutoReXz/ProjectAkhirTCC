require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { sequelize } = require('./src/models');

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const lessonRoutes = require('./src/routes/lesson.routes');
const quizRoutes = require('./src/routes/quiz.routes');
const commentRoutes = require('./src/routes/comment.routes');
const progressRoutes = require('./src/routes/progress.routes');
const adminRoutes = require('./src/routes/admin.routes');

// Import Error Handlers
const { errorHandler, notFound } = require('./src/middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// Configure CORS with specific options
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Total-Count', 'X-Page', 'X-Limit', 'X-Total-Pages'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Language Learning Platform API',
    documentation: '/api/docs'
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'Unknown';
  let dbError = null;
  
  try {
    await sequelize.authenticate();
    dbStatus = 'Connected';
  } catch (error) {
    dbStatus = 'Disconnected';
    dbError = error.message;
  }
  
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      error: dbError
    }
  });
});

// Database debug endpoint
app.get('/api/debug/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT 1 as test, NOW() as current_time');
    
    res.json({
      status: 'success',
      connection: 'OK',
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        dialect: process.env.DB_DIALECT
      },
      test_query: results[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      connection: 'FAILED',
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        dialect: process.env.DB_DIALECT
      },
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
});

// Serve API documentation
app.get('/api/docs', (req, res) => {
  res.sendFile(path.join(__dirname, './src/docs/api.md'));
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Sync database and start server
const startServer = async () => {
  try {
    console.log('🔗 Testing database connection...');
    console.log('Database Host:', process.env.DB_HOST);
    console.log('Database Name:', process.env.DB_NAME);
    console.log('Database User:', process.env.DB_USER);
    
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Run database migrations on startup
    console.log('🚀 Running database migrations...');
    const { execSync } = require('child_process');
    
    try {
      // Create database if it doesn't exist
      console.log('📝 Creating database if needed...');
      execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
    } catch (createError) {
      console.log('ℹ️ Database might already exist, continuing...');
    }
    
    try {
      // Run migrations
      console.log('📋 Running migrations...');
      execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
      console.log('✅ Database migrations completed successfully.');
    } catch (migrateError) {
      console.warn('⚠️ Migration failed, but starting server anyway:', migrateError.message);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
    });
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.name + ':', error.message);
    console.log('🔄 Starting server without database connection...');
    console.log('⚠️ Please check your database configuration and network access');
    
    app.listen(PORT, () => {
      console.log(`⚠️ Server is running on port ${PORT} (without database)`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log('🔧 Fix database connection to enable full functionality');
    });
  }
};

startServer();
