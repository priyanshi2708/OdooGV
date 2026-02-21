const Driver = require('../models/Driver');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = async (req, res) => {
    const drivers = await Driver.find({});
    res.json(drivers);
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private
const getDriverById = async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    if (driver) {
        res.json(driver);
    } else {
        res.status(404).json({ message: 'Driver not found' });
    }
};

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private/Dispatcher
const createDriver = async (req, res) => {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate } = req.body;

    const driverExists = await Driver.findOne({ licenseNumber });

    if (driverExists) {
        return res.status(400).json({ message: 'Driver with this license number already exists' });
    }

    const driver = new Driver({
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate
    });

    const createdDriver = await driver.save();
    req.io.emit('driverStatusUpdate', createdDriver);
    res.status(201).json(createdDriver);
};

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Private/Dispatcher
const updateDriver = async (req, res) => {
    const { name, status, safetyScore, tripCompletionRate, licenseExpiryDate } = req.body;

    const driver = await Driver.findById(req.params.id);

    if (driver) {
        driver.name = name || driver.name;
        driver.status = status || driver.status;
        driver.safetyScore = safetyScore !== undefined ? safetyScore : driver.safetyScore;
        driver.tripCompletionRate = tripCompletionRate !== undefined ? tripCompletionRate : driver.tripCompletionRate;
        driver.licenseExpiryDate = licenseExpiryDate || driver.licenseExpiryDate;

        const updatedDriver = await driver.save();
        req.io.emit('driverStatusUpdate', updatedDriver);
        res.json(updatedDriver);
    } else {
        res.status(404).json({ message: 'Driver not found' });
    }
};

module.exports = { getDrivers, getDriverById, createDriver, updateDriver };
