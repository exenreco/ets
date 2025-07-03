const express = require('express');
const router = express.Router();
const Category = require('../../models/category');

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET categories for specific user
router.get('/users/:userId/categories', async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.params.userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;