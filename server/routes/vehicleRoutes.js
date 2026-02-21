const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');

router.get('/', protect, getVehicles);

router.post(
    '/',
    protect,
    authorize('dispatcher', 'manager', 'admin'),
    createVehicle
);

router.put(
    '/:id',
    protect,
    authorize('dispatcher', 'manager', 'admin'),
    updateVehicle
);

router.delete(
    '/:id',
    protect,
    authorize('manager', 'admin'),
    deleteVehicle
);

module.exports = router;