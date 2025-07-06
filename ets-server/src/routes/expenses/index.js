'use strict';

const // Requirements

    express = require('express'),

    router = express.Router(),

    Expenses = require('../../models/expense'),

    createError = require('http-errors')
;


// POST endpoint to create a new expense
router.post('/add-expense', async (req, res, next) => {
    try {
        const { userId, categoryId, amount, description, date } = req.body;

        // Validate required fields
        if (!userId || !categoryId || !amount || !description || !date)return next(createError(
            400,
            "Missing required fields: userId, categoryId, amount, description, date"
        ));

        // Parse amount to float
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue)) return next(createError(
            400,
            "Amount must be a valid number."
        ));

        // Parse userId to int
        const userIdValue = parseInt(userId, 10);
        if (isNaN(userIdValue)) return next(createError(
            400,
            "An invalid userId was given."
        ));

        // Parse userId to int
        const categoryIdValue = parseInt(categoryId, 10);
        if (isNaN(categoryIdValue)) return next(createError(
            400,
            "An invalid category id was given."
        ));

        // string description
        if ( typeof description !== 'string') return next(createError(
            400,
            "An invalid description was given."
        ));

        // Create new expense using Mongoose model
        const newExpense = new Expenses({
            date:           new Date(date),
            userId:         userIdValue,
            amount:         amountValue,
            categoryId:     categoryIdValue,
            description:    description
        });

        // Save to database using Mongoose
        const savedExpense = await newExpense.save();

        // Send response with created expense
        res.status(201).json(savedExpense);

    } catch (err) {

        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') return next(createError(
            400,
            err.message
        ));

        // Handle duplicate key errors
        if (err.code === 11000) return next(createError(
            400,
            'Duplicate expense detected'
        ));

        next(createError(500, "Internal server error", { detail: err.message }));
    }
});

// GET endpoint to retrieve all expenses from the expenses collection
router.get('/', async (req, res, next) => {
  try {
    const expense = await Expenses.find({});
    res.send(expense);
  } catch (err) {
    console.error('There was a problem retrieving a list of expenses ${err}');
    next(err);
  }
});

// GET endpoint to retrieve all expenses with category names
router.get('/catToName', async (req, res, next) => {
  try {
    const expenses = await Expenses.aggregate([
      {
        $lookup: {
          from: 'categories', // collection name in MongoDB
          localField: 'categoryId',
          foreignField: 'categoryId',
          as: 'category'
        }
      },
      {
        $unwind: '$category' // flatten the category array
      },
      {
        $project: {
          amount: 1,
          description: 1,
          date: 1,
          categoryName: '$category.name',
        }
      }
    ]);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;