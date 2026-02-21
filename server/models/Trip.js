const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    cargoWeight: { type: Number, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    revenue: { type: Number, required: true },
    startOdometer: { type: Number, required: true },
    endOdometer: { type: Number },
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        default: 'Draft'
    },
    fuelUsed: { type: Number }, // in liters
    fuelCost: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
