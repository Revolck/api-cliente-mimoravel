const express = require('express');
const router = express.Router();
const chartGiftMapController = require('../controllers/chartGiftMapController');

router.get('/leads/week', chartGiftMapController.getNewLeadsByWeek);
router.get('/leads/month', chartGiftMapController.getNewLeadsByMonth);

module.exports = router;