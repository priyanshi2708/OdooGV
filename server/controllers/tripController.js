const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');


// ================= CREATE TRIP =================
const createTrip = async (req, res) => {
    try {
        const {
            vehicle,
            driver,
            origin,
            destination,
            cargoWeight,
            revenue
        } = req.body;

        if (!vehicle || !driver) {
            return res.status(400).json({ message: 'Vehicle and Driver required' });
        }

        const newTrip = await Trip.create({
            vehicle,
            driver,
            origin,
            destination,
            cargoWeight,
            revenue
        });

        res.status(201).json(newTrip);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================= GET TRIPS =================
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('vehicle')
            .populate('driver')
            .sort({ createdAt: -1 });

        res.json(trips);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================= COMPLETE TRIP =================
const completeTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.status = 'Completed';
        await trip.save();

        res.json(trip);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTrip,
    getTrips,
    completeTrip
};