const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

dotenv.config();

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleetflow');

        console.log('Clearing existing data...');
        await User.deleteMany();
        await Vehicle.deleteMany();
        await Driver.deleteMany();

        console.log('Creating admin user...');
        const admin = await User.create({
            name: 'Admin Manager',
            email: 'admin@fleetflow.com',
            password: 'password123',
            role: 'manager'
        });

        console.log('Creating test vehicles...');
        const v1 = await Vehicle.create({
            name: 'Iron Goliath',
            model: 'Volvo FH16',
            licensePlate: 'TRK-001',
            vehicleType: 'Truck',
            maxLoadCapacity: 25000,
            acquisitionCost: 150000,
            odometer: 12500
        });

        console.log('Creating test drivers...');
        const d1 = await Driver.create({
            name: "Sam 'The Rig' Rogers",
            licenseNumber: 'DL-9988',
            licenseCategory: 'Class A',
            licenseExpiryDate: new Date('2028-12-31'),
            safetyScore: 98,
            tripCompletionRate: 100
        });

        console.log('Database Seeded Successfully!');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
