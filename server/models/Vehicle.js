const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    vehicleType: { type: String, enum: ['Truck', 'Van', 'Bike'], required: true },
    maxLoadCapacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'OnTrip', 'InShop', 'Retired'],
        default: 'Available'
    },
    acquisitionCost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
