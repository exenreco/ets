'use strict';

const // Requirements

    express = require('express'),

    router = express.Router(),

    Categories = require('../../models/category'),

    createError = require('http-errors')
;

// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Categories.find({});
    res.json(categories);
  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

// GET categories for specific user
router.get('/:userId', async (req, res, next) => {
  try {

    const userId  = req.params.userId;

    console.log(userId);
    
    // a userId is required
    if ( ! userId ) throw createError(
      400, 'a userId is required!'
    );

    // userId must be an integer
    const userIdValue = parseInt(userId, 10);
    if (isNaN(userIdValue)) return next(createError(
       400, "invalid user id type!"
    ));

    // record user categories
    const categories = await Categories.find({ userId: userIdValue })

    res.json(categories);

  } catch (err) {

    next(createError(500, "Internal server error", { detail: err.message }));

  }
});

module.exports = router;