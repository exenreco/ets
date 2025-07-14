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

    const 
    categories = await Categories.find({}),
    resObj = {
      name:         Category.name,
      slug:         Category.slug,
      categoryId:   Category.categoryId,
      description:  Category.description,
    };

    if( categories ) res.json(resObj);

    else throw createError(
      404, 'invalid, categories not found!'
    );

  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

// GET: Fetch all categories for specific user
router.get('/get-user-categories', async (req, res, next) => {
  try {

    const userId  = req.query.userId;
    
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
    const 
    categories = await Categories.find({ userId: userIdValue });

    if( categories) res.json([...categories]);

    else throw createError(
      404, 'invalid, categories not found!'
    );

  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

// GET: Fetches and returns a single category name for the given id
router.get('/get-name', async (req, res, next) => {
  try {
    const categoryId  = req.query.categoryId;
    console.log(typeof categoryId);

    // a categoryId is required
    if ( ! categoryId ) throw createError(
      400, 'a categoryId is required!'
    );

    // record category details
    const categories = await Categories.findOne({ categoryId: categoryId });

    if( categories && categories.name) res.json(categories.name); // return the category name
    else throw createError(
      404, 'invalid, category Name not found!'
    );

  } catch (err) {
    next(createError(500, "Internal server error", { detail: err.message }));
  }
});

module.exports = router;