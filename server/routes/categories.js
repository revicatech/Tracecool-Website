const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories (public)
router.get('/', async (req, res) => {
  try {
    const cats = await Category.find().sort({ order: 1, createdAt: -1 });
    res.json(cats);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories
router.post('/', protect, [
  body('name_en').trim().notEmpty().withMessage('English name required'),
  body('name_ar').trim().notEmpty().withMessage('Arabic name required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Category slug already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/categories/:id
router.put('/:id', protect, [
  body('name_en').optional().trim().notEmpty(),
  body('name_ar').optional().trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const used = await Subcategory.exists({ category: req.params.id });
    if (used) return res.status(400).json({ message: 'Cannot delete: category has subcategories' });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
