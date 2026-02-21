const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: String,
    licensePlate: String,
    odometer: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Available', 'OnTrip', 'InShop'],
        default: 'Available'
    },

    // 🔥 Maintenance Fields
    lastServiceOdometer: {
        type: Number,
        default: 0
    },
    serviceInterval: {
        type: Number,
        default: 10000 // every 10,000 km
    }

}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);