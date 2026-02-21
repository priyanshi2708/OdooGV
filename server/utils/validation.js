const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('manager', 'dispatcher', 'safety', 'finance')
});

const vehicleSchema = Joi.object({
    name: Joi.string().required(),
    model: Joi.string().required(),
    licensePlate: Joi.string().required(),
    vehicleType: Joi.string().valid('Truck', 'Van', 'Bike').required(),
    maxLoadCapacity: Joi.number().positive().required(),
    acquisitionCost: Joi.number().positive().required()
});

const tripSchema = Joi.object({
    vehicleId: Joi.string().required(),
    driverId: Joi.string().required(),
    cargoWeight: Joi.number().positive().required(),
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    revenue: Joi.number().positive().required(),
    startOdometer: Joi.number().min(0).required()
});

module.exports = { userSchema, vehicleSchema, tripSchema };
