const express = require('express');
const router = express.Router();
const { createTrip, dispatchTrip, completeTrip, getTrips } = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getTrips)
    .post(protect, authorize('dispatcher', 'manager'), createTrip);

router.put('/:id/dispatch', protect, authorize('dispatcher', 'manager'), dispatchTrip);
router.put('/:id/complete', protect, authorize('dispatcher', 'manager'), completeTrip);

module.exports = router;
