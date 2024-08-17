const express = require('express');
const router = express.Router();
const giftMapController = require('../controllers/giftMapController');

router.get('/search', giftMapController.getGiftMap);
router.post('/register', giftMapController.addGiftMap);
router.delete('/:id', giftMapController.deleteGiftMap);

module.exports = router;
