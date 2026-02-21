const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const Expense = require('../models/Expense');

// @desc    Create maintenance log
// @route   POST /api/maintenance
// @access  Private/Safety
const createMaintenance = async (req, res) => {
    const { vehicleId, serviceType, cost, notes, date } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    const maintenance = new Maintenance({
        vehicle: vehicleId,
        serviceType,
        cost,
        notes,
        date
    });

    const createdMaintenance = await maintenance.save();

    // Business Rule 5: When maintenance log created: vehicle.status = InShop
    await Vehicle.findByIdAndUpdate(vehicleId, { status: 'InShop' });

    // Add to expenses
    const expense = new Expense({
        vehicle: vehicleId,
        type: 'Maintenance',
        amount: cost,
        date: date || Date.now()
    });
    await expense.save();

    req.io.emit('maintenanceAlert', createdMaintenance);
    req.io.emit('vehicleStatusUpdate', { _id: vehicleId, status: 'InShop' });

    res.status(201).json(createdMaintenance);
};

// @desc    Get maintenance history for a vehicle
// @route   GET /api/maintenance/:vehicleId
// @access  Private
const getMaintenanceHistory = async (req, res) => {
    const maintenance = await Maintenance.find({ vehicle: req.params.vehicleId }).sort({ date: -1 });
    res.json(maintenance);
};

module.exports = { createMaintenance, getMaintenanceHistory };
