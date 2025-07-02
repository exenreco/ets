'use strict';

const
    express = require('express'),
    router = express.Router(),
    { mongo } = require('../../utils/mongo'),
    createError = require('http-errors');


// POST endpoint to create a new expense
router.post('/', async (req, res, next) => {
    try {
        const expense = req.body;
        
        // Validate required fields
        if (!expense.userId || !expense.categoryId || !expense.amount || !expense.description || !expense.date)
        return next(createError(400, "Missing required fields: userId, categoryId, amount, description, date"));
        

        // Parse amount to float
        const amount = parseFloat(expense.amount);
        if (isNaN(amount)) return next(createError(400, "Amount must be a valid number"));

        // Prepare new expense document
        const newExpense = {
            userId: expense.userId,
            categoryId: expense.categoryId,
            amount: amount.toFixed(2), // Store as fixed-decimal string
            description: expense.description,
            date: new Date(expense.date), // Ensure proper Date format
            dateCreated: new Date(), // Current timestamp for creation
            dateModified: new Date() // Current timestamp for modification
        };

        // Insert into MongoDB
        await mongo(async db => {
            const result = await db.collection('expenses').insertOne(newExpense);
            newExpense._id = result.insertedId; // Add generated ObjectID to response
            res.status(201).json(newExpense);
        });

    } catch (err) {
        next(createError(500, "Internal server error", { detail: err.message }));
    }
});

module.exports = router;