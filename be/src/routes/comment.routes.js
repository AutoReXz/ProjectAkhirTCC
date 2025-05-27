const express = require('express');
const commentController = require('../controllers/comment.controller');
const { verifyAccessToken } = require('../middlewares/auth.middleware');
const { commentValidationRules, validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Rute-rute ini juga dapat diakses melalui /lessons/:id/komentar
// Namun, kita pisahkan agar bisa menambah fungsionalitas khusus komentar

router.get('/lesson/:id', commentController.getCommentsByLessonId);
router.post('/lesson/:id', verifyAccessToken, commentValidationRules, validate, commentController.createComment);

module.exports = router;
