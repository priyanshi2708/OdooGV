const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');

// @desc    Get dashboard KPIs
// @route   GET /api/analytics/kpis
// @access  Private
const getKPIs = async (req, res) => {
    const activeFleet = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });
    const onTrip = await Vehicle.countDocuments({ status: 'OnTrip' });
    const inShop = await Vehicle.countDocuments({ status: 'InShop' });
    const utilizationRate = activeFleet > 0 ? (onTrip / activeFleet) * 100 : 0;

    const totalRevenue = await Trip.aggregate([{ $group: { _id: null, total: { $sum: "$revenue" } } }]);
    const totalExpenses = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

    res.json({
        activeFleet,
        onTrip,
        inShop,
        utilizationRate,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        netProfit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0)
    });
};

// @desc    Get ROI and Fuel Efficiency per vehicle
// @route   GET /api/analytics/vehicle-stats
// @access  Private
const getVehicleStats = async (req, res) => {
    const vehicles = await Vehicle.find({});
    const stats = await Promise.all(vehicles.map(async (v) => {
        const trips = await Trip.find({ vehicle: v._id, status: 'Completed' });
        const maintenance = await Maintenance.find({ vehicle: v._id });
        const fuelExpenses = await Expense.find({ vehicle: v._id, type: 'Fuel' });

        const totalRev = trips.reduce((sum, t) => sum + t.revenue, 0);
        const totalMaint = maintenance.reduce((sum, m) => sum + m.cost, 0);
        const totalFuel = fuelExpenses.reduce((sum, f) => sum + f.amount, 0);
        const totalDistance = trips.reduce((sum, t) => sum + (t.endOdometer - t.startOdometer), 0);
        const totalFuelLiters = trips.reduce((sum, t) => sum + (t.fuelUsed || 0), 0);

        // Business Rule 6: ROI = (Revenue - (Fuel + Maintenance)) / AcquisitionCost
        const roi = v.acquisitionCost > 0 ? (totalRev - (totalFuel + totalMaint)) / v.acquisitionCost : 0;

        // Fuel Efficiency = KM / L
        const fuelEfficiency = totalFuelLiters > 0 ? totalDistance / totalFuelLiters : 0;

        return {
            name: v.name,
            licensePlate: v.licensePlate,
            roi: roi.toFixed(2),
            fuelEfficiency: fuelEfficiency.toFixed(2),
            totalRevenue: totalRev,
            totalCost: totalFuel + totalMaint
        };
    }));

    res.json(stats);
};

module.exports = { getKPIs, getVehicleStats };
