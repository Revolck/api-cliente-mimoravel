const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para refresh de token
router.post('/refresh', authController.refreshToken);

// Rota para logout
router.post('/logout', authController.logoutUser);

module.exports = router;
