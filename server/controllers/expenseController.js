const Expense = require('../models/Expense');

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
    const { vehicleId, type, amount, date } = req.body;

    const expense = new Expense({
        vehicle: vehicleId,
        type,
        amount,
        date
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
};

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private/Finance
const getExpenses = async (req, res) => {
    const expenses = await Expense.find({}).populate('vehicle');
    res.json(expenses);
};

module.exports = { addExpense, getExpenses };
