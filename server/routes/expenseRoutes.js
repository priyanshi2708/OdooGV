const express = require('express');
const router = express.Router();
const { addExpense, getExpenses } = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('finance', 'manager'), getExpenses)
    .post(protect, addExpense);

module.exports = router;
