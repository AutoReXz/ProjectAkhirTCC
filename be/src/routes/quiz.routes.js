const express = require('express');
const quizController = require('../controllers/quiz.controller');
const { verifyAccessToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Submit quiz answer
router.post('/:id/submit', verifyAccessToken, quizController.submitQuizAnswer);

module.exports = router;
