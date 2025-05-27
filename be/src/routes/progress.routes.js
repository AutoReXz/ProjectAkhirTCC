const express = require('express');
const progressController = require('../controllers/progress.controller');
const { verifyAccessToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get user progress
router.get('/', verifyAccessToken, progressController.getUserProgress);

module.exports = router;
