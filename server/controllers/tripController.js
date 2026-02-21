const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private/Dispatcher
const createTrip = async (req, res) => {
    const { vehicleId, driverId, cargoWeight, origin, destination, revenue, startOdometer } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await Driver.findById(driverId);

    if (!vehicle || !driver) {
        return res.status(404).json({ message: 'Vehicle or Driver not found' });
    }

    // Business Rule 1: Prevent trip creation if cargoWeight > vehicle.maxLoadCapacity
    if (cargoWeight > vehicle.maxLoadCapacity) {
        return res.status(400).json({ message: 'Cargo weight exceeds vehicle max load capacity' });
    }

    // Business Rule 2: Prevent driver assignment if license expired or driver not OnDuty
    const today = new Date();
    if (driver.licenseExpiryDate < today) {
        return res.status(400).json({ message: 'Driver license has expired' });
    }
    if (driver.status !== 'OnDuty') {
        return res.status(400).json({ message: 'Driver is not available (Status not OnDuty)' });
    }
    if (vehicle.status !== 'Available') {
        return res.status(400).json({ message: 'Vehicle is not available' });
    }

    const trip = new Trip({
        vehicle: vehicleId,
        driver: driverId,
        cargoWeight,
        origin,
        destination,
        revenue,
        startOdometer,
        status: 'Draft'
    });

    const createdTrip = await trip.save();
    req.io.emit('newTrip', createdTrip);
    res.status(201).json(createdTrip);
};

// @desc    Dispatch a trip
// @route   PUT /api/trips/:id/dispatch
// @access  Private/Dispatcher
const dispatchTrip = async (req, res) => {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
        trip.status = 'Dispatched';
        await trip.save();

        // Business Rule 3: When trip status changes to "Dispatched":
        // vehicle.status = OnTrip, driver.status = OnTrip
        await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'OnTrip' });
        await Driver.findByIdAndUpdate(trip.driver, { status: 'OnTrip' });

        req.io.emit('tripStatusUpdate', trip);
        req.io.emit('vehicleStatusUpdate', { _id: trip.vehicle, status: 'OnTrip' });
        req.io.emit('driverStatusUpdate', { _id: trip.driver, status: 'OnTrip' });

        res.json(trip);
    } else {
        res.status(404).json({ message: 'Trip not found' });
    }
};

// @desc    Complete a trip
// @route   PUT /api/trips/:id/complete
// @access  Private/Dispatcher
const completeTrip = async (req, res) => {
    const { endOdometer, fuelUsed, fuelCost } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (trip) {
        trip.status = 'Completed';
        trip.endOdometer = endOdometer;
        trip.fuelUsed = fuelUsed;
        trip.fuelCost = fuelCost;
        await trip.save();

        // Business Rule 4: When trip marked "Completed":
        // vehicle.status = Available, driver.status = OnDuty
        // Update vehicle odometer
        await Vehicle.findByIdAndUpdate(trip.vehicle, {
            status: 'Available',
            odometer: endOdometer
        });
        await Driver.findByIdAndUpdate(trip.driver, { status: 'OnDuty' });

        // Emit updates
        req.io.emit('tripStatusUpdate', trip);
        req.io.emit('vehicleStatusUpdate', { _id: trip.vehicle, status: 'Available', odometer: endOdometer });
        req.io.emit('driverStatusUpdate', { _id: trip.driver, status: 'OnDuty' });

        res.json(trip);
    } else {
        res.status(404).json({ message: 'Trip not found' });
    }
};

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
    const trips = await Trip.find({}).populate('vehicle driver');
    res.json(trips);
};

module.exports = { createTrip, dispatchTrip, completeTrip, getTrips };
