'use strict';

const
    express = require('express'),
    router = express.Router(),
    { mongo } = require('../../utils/mongo'),
    createError = require('http-errors');


// Get category by user id
// GET /api/categories?user=1000
router.get('/', async (req, res, next) => {
    const 
        userIDstr = req.query.userID,
        userID = parseInt(userIDstr, 10);

    if (!userIDstr) return next(createError(400, "Missing required query parameter: user"));

    if (Number.isNaN(userID)) return next(createError(400, "Invalid user ID; must be a number"));

    try {
       await mongo(async db => {

        const categories = await db

            .collection('categories')

            .aggregate([

                { $match: { userId: userID } },

                { $project: {  _id: 0, categoryId: '$categoryId', userId: 1, name: 1 } },

                { $sort: { name: 1 } }

            ]).toArray();

      res.send(categories);

    }, next);

    } catch (err) {
        next(createError(500, "Failed to fetch categories", { detail: err.message }));
    }
});

module.exports = router;