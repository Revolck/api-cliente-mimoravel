const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/tags', tagController.getTags);
router.post('/tags', tagController.addTag);

module.exports = router;
