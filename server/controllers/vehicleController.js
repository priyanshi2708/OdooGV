const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404).json({ message: 'Vehicle not found' });
    }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Manager
const createVehicle = async (req, res) => {
    const { name, model, licensePlate, vehicleType, maxLoadCapacity, acquisitionCost } = req.body;

    const vehicleExists = await Vehicle.findOne({ licensePlate });

    if (vehicleExists) {
        return res.status(400).json({ message: 'Vehicle with this license plate already exists' });
    }

    const vehicle = new Vehicle({
        name,
        model,
        licensePlate,
        vehicleType,
        maxLoadCapacity,
        acquisitionCost
    });

    const createdVehicle = await vehicle.save();
    req.io.emit('vehicleStatusUpdate', createdVehicle);
    res.status(201).json(createdVehicle);
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Manager
const updateVehicle = async (req, res) => {
    const { name, model, licensePlate, vehicleType, maxLoadCapacity, status, odometer } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
        vehicle.name = name || vehicle.name;
        vehicle.model = model || vehicle.model;
        vehicle.licensePlate = licensePlate || vehicle.licensePlate;
        vehicle.vehicleType = vehicleType || vehicle.vehicleType;
        vehicle.maxLoadCapacity = maxLoadCapacity || vehicle.maxLoadCapacity;
        vehicle.status = status || vehicle.status;
        vehicle.odometer = odometer || vehicle.odometer;

        const updatedVehicle = await vehicle.save();
        req.io.emit('vehicleStatusUpdate', updatedVehicle);
        res.json(updatedVehicle);
    } else {
        res.status(404).json({ message: 'Vehicle not found' });
    }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Manager
const deleteVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } else {
        res.status(404).json({ message: 'Vehicle not found' });
    }
};

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
