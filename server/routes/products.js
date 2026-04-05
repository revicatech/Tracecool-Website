const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Extract Cloudinary public_id from a secure URL
const getPublicId = (url) => {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : null;
};

const deleteFromCloudinary = async (url) => {
  const publicId = getPublicId(url);
  if (publicId) await cloudinary.uploader.destroy(publicId);
};

// GET /api/products (public)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    const products = await Product.find(filter)
      .populate('category', 'name_en name_ar')
      .populate('subcategory', 'name_en name_ar')
      .sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name_en name_ar')
      .populate('subcategory', 'name_en name_ar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products
router.post('/', protect, upload.array('images', 10), [
  body('title_en').trim().notEmpty().withMessage('English title required'),
  body('title_ar').trim().notEmpty().withMessage('Arabic title required'),
  body('description_en').trim().notEmpty().withMessage('English description required'),
  body('description_ar').trim().notEmpty().withMessage('Arabic description required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const images = (req.files || []).map(f => f.path);
    let features = [];
    if (req.body.features) {
      try { features = JSON.parse(req.body.features); } catch {}
    }

    const product = await Product.create({ ...req.body, images, features });
    await product.populate('category subcategory', 'name_en name_ar');
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newImages = (req.files || []).map(f => f.path);

    // Merge with kept existing images
    let keptImages = [];
    if (req.body.keptImages) {
      try { keptImages = JSON.parse(req.body.keptImages); } catch {}
    }

    // Delete removed images from Cloudinary
    const removed = product.images.filter(img => !keptImages.includes(img));
    await Promise.all(removed.map(deleteFromCloudinary));

    const allImages = [...keptImages, ...newImages].slice(0, 10);

    let features = product.features;
    if (req.body.features) {
      try { features = JSON.parse(req.body.features); } catch {}
    }

    const updates = { ...req.body, images: allImages, features };
    delete updates.keptImages;

    Object.assign(product, updates);
    await product.save();
    await product.populate('category subcategory', 'name_en name_ar');
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Promise.all(product.images.map(deleteFromCloudinary));

    res.json({ message: 'Product deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
