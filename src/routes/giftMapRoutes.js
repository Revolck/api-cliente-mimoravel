const express = require('express');
const router = express.Router();
const giftMapController = require('../controllers/giftMapController');

router.get('/search', giftMapController.getGiftMap);
router.post('/register', giftMapController.addGiftMap);
router.delete('/:id', giftMapController.deleteGiftMap);
router.get('/:id', giftMapController.getGiftMapById);
router.put('/:id/status', giftMapController.updateGiftMapStatus);

module.exports = router;
