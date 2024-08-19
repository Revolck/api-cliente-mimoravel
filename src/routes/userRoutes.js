const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.addUser);
router.post('/login', userController.loginUser);
router.put('/profile', userController.updateUserProfile);
router.get('/profile/:username', userController.getUserProfile);

module.exports = router;
