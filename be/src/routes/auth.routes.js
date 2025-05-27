const express = require('express');
const authController = require('../controllers/auth.controller');
const { registerValidationRules, loginValidationRules, validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Rute registrasi
router.post('/register', registerValidationRules, validate, authController.register);

// Rute login
router.post('/login', loginValidationRules, validate, authController.login);

// Rute refresh token
router.post('/refresh', authController.refreshToken);

// Rute logout
router.post('/logout', authController.logout);

module.exports = router;
