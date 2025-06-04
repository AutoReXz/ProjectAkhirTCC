const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyAccessToken, verifyAdmin } = require('../middlewares/auth.middleware');
const { validateAdmin } = require('../middlewares/validation.middleware');

// Apply authentication and admin middleware to all routes
router.use(verifyAccessToken);
router.use(verifyAdmin);

// Dashboard Statistics
router.get('/stats', adminController.getStats);

// User Management Routes
router.get('/users', adminController.getAllUsers);
router.post('/users', validateAdmin.createUser, adminController.createUser);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', validateAdmin.updateUser, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Quiz Management Routes
router.get('/quizzes', adminController.getAllQuizzes);
router.post('/quizzes', validateAdmin.createQuiz, adminController.createQuiz);
router.put('/quizzes/:id', validateAdmin.updateQuiz, adminController.updateQuiz);
router.delete('/quizzes/:id', adminController.deleteQuiz);

// Comment Management Routes
router.get('/comments', adminController.getAllComments);
router.put('/comments/:id', validateAdmin.updateComment, adminController.updateComment);
router.delete('/comments/:id', adminController.deleteComment);

// Lesson Management Routes
router.get('/lessons', adminController.getAllLessons);
router.post('/lessons', validateAdmin.createLesson, adminController.createLesson);
router.put('/lessons/:id', validateAdmin.updateLesson, adminController.updateLesson);
router.delete('/lessons/:id', adminController.deleteLesson);

module.exports = router;