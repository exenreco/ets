'use strict';

const // Requirements

    express = require('express'),

    router = express.Router(),

    Categories = require('../../models/category'),

    createError = require('http-errors')
;

// GET all categories
router.get('', async (req, res, next) => {
  try {

    const categories = await Categories.find({});

    if( ! categories ) throw next(createError(404, 'invalid, categories not found!'));
    else return res.json([...categories].map(category => ({
      name:         category.name,
      slug:         category.slug,
      categoryId:   category.categoryId,
      description:  category.description,
    })));

  } catch (err) {
    next(createError(500, "Internal server error", { detail: err }));
  }
});

// GET: Fetch all categories for specific user
router.get('', async (req, res, next) => {
  try {

    const { userId }  = req.query;

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


// Adding new expense category
router.post('/add-category', async (req, res, next) => {
  try {
    const { userId, name, slug, description } = req.body;

    // Validate required fields
    if ( !userId || !name || !description || !slug )return next(createError(
      400,
      "Missing required fields: userId, name, description or slug."
    ));

    // Parse userId to int
    const userIdValue = parseInt(userId, 10);
    if (isNaN(userIdValue)) return next(createError(
      400,
      "An invalid userId was given."
    ));

    // string name
    if ( typeof name !== 'string') return next(createError(
      400,
      "An invalid name was given."
    ));

    // string slug
    if ( typeof slug !== 'string') return next(createError(
      400,
      "An invalid slug was given."
    ));

    // string description
    if ( typeof description !== 'string') return next(createError(
      400,
      "An invalid description was given."
    ));

    // Create new expense using Mongoose model
    const newCategory = new Categories({
      userId:         userIdValue,
      name:           name,
      slug:           slug,
      description:    description,
      dateCreated:    new Date()
    });

    // Save to database using Mongoose
    const savedCategory = await newCategory.save();

    // Send response with created expense
    res.status(201).json(savedCategory);

  } catch (err) {

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') return next(createError(
      400,
      err.message
    ));

    // Handle duplicate key errors
    if (err.code === 11000) return next(createError(
      400,
      'Duplicate Category detected'
    ));

    next(createError(500, "Internal server error", { detail: err.message }));
  }

});

//PUT: endpoint to update a category
router.put('/:categoryId', async (req, res, next) => {
  try {

    const
      { categoryId } = req.params, // Get ID from URL
      { userId, name, slug, description } = req.body
    ;

    // Parse userId to int
    const categoryIdValue = parseInt(categoryId, 10);
    if ( isNaN(categoryIdValue) ) return next(createError(
      400,
      "An invalid category id in url."
    ));

    // Validate required fields
    if ( !userId || !name || !slug || !description )return next(
      createError(
        400,
        "Missing required fields: userId, categoryId, amount, description, date or expenseId"
      )
    );

    // Parse userId to int
    const userIdValue = parseInt(userId, 10);
    if (isNaN(userIdValue)) return next(createError(
      400,
      "An invalid userId was given."
    ));

    // string description
    if ( typeof description !== 'string') return next(createError(
      400,
      "An invalid description was given."
    ));

    // string slug
    if ( typeof slug !== 'string') return next(createError(
      400,
      "An invalid slug was given."
    ));

    // string name
    if ( typeof name !== 'string') return next(createError(
      400,
      "An invalid name was given."
    ));

    const updatedCategory = await Categories.findOneAndUpdate(
      {categoryId: categoryIdValue},
      {$set: {
        name:         name,
        slug:         slug,
        description:  description
      }},
      {new: true, runValidators: true}
    );

    if (!updatedCategory)
      return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(updatedCategory);

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

router.delete('/:categoryId', async (req, res, next) => {
  try {
    await Categories.deleteOne({ categoryId: req.params.categoryId });
    res.send({ message: 'Category deleted successfully', id: req.params.categoryId });
  } catch (err) {
    next(err);
  }
});



module.exports = router;