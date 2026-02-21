const express = require('express');
const router = express.Router();
const {
    createMaintenance,
    getMaintenanceLogs
} = require('../controllers/maintenanceController');

router.post('/', createMaintenance);
router.get('/', getMaintenanceLogs);

module.exports = router;