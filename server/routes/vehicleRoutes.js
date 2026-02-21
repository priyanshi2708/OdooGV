const express = require('express');
const router = express.Router();
const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getVehicles)
    .post(protect, authorize('manager'), createVehicle);

router.route('/:id')
    .get(protect, getVehicleById)
    .put(protect, authorize('manager'), updateVehicle)
    .delete(protect, authorize('manager'), deleteVehicle);

module.exports = router;
