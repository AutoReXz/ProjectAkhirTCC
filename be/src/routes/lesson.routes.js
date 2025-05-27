const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const commentController = require('../controllers/comment.controller');
const quizController = require('../controllers/quiz.controller');
const { verifyAccessToken, verifyAdmin } = require('../middlewares/auth.middleware');
const { lessonValidationRules, commentValidationRules, quizValidationRules, validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Public routes
router.get('/', lessonController.getAllLessons);
router.get('/:id', lessonController.getLessonById);

// Protected routes
router.post('/', verifyAccessToken, verifyAdmin, lessonValidationRules, validate, lessonController.createLesson);
router.put('/:id', verifyAccessToken, verifyAdmin, lessonValidationRules, validate, lessonController.updateLesson);
router.delete('/:id', verifyAccessToken, verifyAdmin, lessonController.deleteLesson);

// Comments routes
router.get('/:id/comments', commentController.getCommentsByLessonId);
router.post('/:id/comments', verifyAccessToken, commentValidationRules, validate, commentController.createComment);

// Quizzes routes
router.get('/:lessonId/quizzes', verifyAccessToken, quizController.getQuizzesByLessonId);
router.post('/:lessonId/quizzes', verifyAccessToken, verifyAdmin, quizValidationRules, validate, quizController.createQuiz);

module.exports = router;
