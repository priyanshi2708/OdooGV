const express = require('express');
const router = express.Router();
const { getKPIs, getVehicleStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/kpis', protect, getKPIs);
router.get('/vehicle-stats', protect, getVehicleStats);

module.exports = router;
