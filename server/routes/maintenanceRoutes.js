const express = require('express');
const router = express.Router();
const { createMaintenance, getMaintenanceHistory } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .post(protect, authorize('safety', 'manager'), createMaintenance);

router.route('/:vehicleId')
    .get(protect, getMaintenanceHistory);

module.exports = router;
