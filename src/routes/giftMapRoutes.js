const express = require('express');
const router = express.Router();
const giftMapController = require('../controllers/giftMapController');

router.get('/gift_map', giftMapController.getGiftMap);
router.post('/gift_map', giftMapController.addGiftMap);

module.exports = router;
