'use strict';

const // Requirements

  express = require('express'),

  router = express.Router(),

  Expenses = require('../../models/expense'),

  createError = require('http-errors')
;

//POST: fetches all expenses
router.get('', async (req, res, next) => {
  try {

    const expenses = await Expenses.find({});

    if( expenses ) res.json(expenses);

    else throw createError(
      404, 'invalid, categories not found!'
    );

  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

//POST: fetches all expenses by userId
router.get('/user/:userId', async (req, res, next) => {
  try {
    const userId  = req.params.userId;

    // a categoryId is required
    if ( ! userId ) throw createError(
      400, 'a userId is required!'
    );

    // userId must be an integer
    const userIdValue = parseInt(userId, 10);
    if (isNaN(userIdValue)) return next(createError(
      400, "invalid user id type!"
    ));

    // record category details
    const expenses = await Expenses.find({ userId: userIdValue });

    if( expenses ) res.json(expenses); // return the category name
    else res.json([]);

  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

//POST: endpoint to add a new expense
router.post('/add-expense', async (req, res, next) => {
    try {
      const { userId, categoryId, amount, description, date } = req.body;

      // Validate required fields
      if (!userId || !categoryId || !amount || !description || !date)return next(createError(
        400,
        "Missing required fields: userId, categoryId, amount, description, date"
      ));

      // Check given date
      const dateValue = new Date(date);
      if ( isNaN(dateValue.getTime()) ) return next(createError(
        400,
        "Invalid date. Must be a valid ISO string, e.g., '2025-07-09T14:30:00Z'."
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
        date:           dateValue,
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

//PUT: endpoint to update an expense
router.put('/:expenseId', async (req, res, next) => {
  try {

    const
      { expenseId } = req.params, // Get ID from URL
      { date, userId, amount, categoryId, description } = req.body
    ;

    // Parse userId to int
    const expenseIdValue = parseInt(expenseId, 10);
    if ( isNaN(expenseIdValue) ) return next(createError(
      400,
      "An invalid expense id in url."
    ));

    // Validate required fields
    if (!userId || !categoryId || !amount || !description || !date )return next(
      createError(
        400,
        "Missing required fields: userId, categoryId, amount, description, date or expenseId"
      )
    );

    // Check given date
    const dateValue = new Date(date);
    if ( isNaN(dateValue.getTime()) ) return next(createError(
      400,
      "Invalid date. Must be a valid ISO string, e.g., '2025-07-09T14:30:00Z'."
    ));

    // Parse amount to float
    const amountValue = parseFloat(amount).toFixed(2);
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

    const updatedExpense = await Expenses.findOneAndUpdate(
      {expenseId: expenseIdValue},
      {$set: {
        date:           dateValue,
        amount:         amountValue,
        categoryId:     categoryIdValue,
        description:    description
        //userId:         userIdValue, not needed
      }},
      {new: true, runValidators: true}
    );

    if (!updatedExpense)
      return res.status(404).json({ message: 'Expense not found' });

    res.status(200).json(updatedExpense);

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

router.delete('/:expenseId', async (req, res, next) => {
  try {
    await Expenses.deleteOne({ expenseId: req.params.expenseId });
    res.send({ message: 'Expense deleted successfully', id: req.params.expenseId });
  } catch (err) {
    console.error(`Error while deleting expense: ${err}`);
    next(err);
  }
});

module.exports = router;