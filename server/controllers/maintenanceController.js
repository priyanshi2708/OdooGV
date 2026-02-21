const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// ================= CREATE MAINTENANCE =================
const createMaintenance = async (req, res) => {
    try {
        const { vehicleId, serviceType, cost, notes } = req.body;

        if (!vehicleId) {
            return res.status(400).json({ message: 'Vehicle ID is required' });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const maintenance = new Maintenance({
            vehicle: vehicleId,
            serviceType,
            cost,
            notes
        });

        const savedMaintenance = await maintenance.save();

        // 🔥 Reset service cycle
        vehicle.lastServiceOdometer = vehicle.odometer;
        await vehicle.save();

        res.status(201).json(savedMaintenance);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// ================= GET ALL MAINTENANCE LOGS =================
const getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await Maintenance.find()
            .populate('vehicle')
            .sort({ createdAt: -1 });

        res.json(logs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createMaintenance,
    getMaintenanceLogs
};