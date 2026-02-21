const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseCategory: { type: String, required: true },
    licenseExpiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['OnDuty', 'OffDuty', 'Suspended', 'OnTrip'],
        default: 'OnDuty'
    },
    safetyScore: { type: Number, default: 100 },
    tripCompletionRate: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
