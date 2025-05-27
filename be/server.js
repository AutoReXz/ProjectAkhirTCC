require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: sequelize.authenticate().then(() => 'Connected').catch(() => 'Disconnected')
    }
  });
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
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
