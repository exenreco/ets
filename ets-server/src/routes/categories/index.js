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
    const categories = await Categories.find({ userId: req.params.userId });
    res.json(categories);
  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

module.exports = router;