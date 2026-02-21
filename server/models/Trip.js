const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
    {
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true
        },
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        cargoWeight: {
            type: Number,
            required: true
        },
        revenue: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Active', 'Completed'],
            default: 'Pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);