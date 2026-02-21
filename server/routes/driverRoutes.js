const express = require('express');
const router = express.Router();
const { getDrivers, getDriverById, createDriver, updateDriver } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getDrivers)
    .post(protect, authorize('dispatcher', 'manager'), createDriver);

router.route('/:id')
    .get(protect, getDriverById)
    .put(protect, authorize('dispatcher', 'manager'), updateDriver);

module.exports = router;
