const express = require('express');
const { body, validationResult } = require('express-validator');
const Subcategory = require('../models/Subcategory');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/subcategories?category=id (public)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const subs = await Subcategory.find(filter).populate('category', 'name_en name_ar').sort({ order: 1, createdAt: -1 });
    res.json(subs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/subcategories
router.post('/', protect, [
  body('name_en').trim().notEmpty().withMessage('English name required'),
  body('name_ar').trim().notEmpty().withMessage('Arabic name required'),
  body('category').notEmpty().withMessage('Category required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const sub = await Subcategory.create(req.body);
    await sub.populate('category', 'name_en name_ar');
    res.status(201).json(sub);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/subcategories/:id
router.put('/:id', protect, [
  body('name_en').optional().trim().notEmpty(),
  body('name_ar').optional().trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const sub = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name_en name_ar');
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(sub);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/subcategories/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subcategory deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
