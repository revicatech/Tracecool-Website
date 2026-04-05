const express = require('express');
const { body, validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

const getPublicId = (url) => {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : null;
};

const deleteFromCloudinary = async (url) => {
  const publicId = getPublicId(url);
  if (publicId) await cloudinary.uploader.destroy(publicId);
};

router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ order: 1, createdAt: -1 });
    res.json(agents);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const a = await Agent.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Agent not found' });
    res.json(a);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, upload.single('image'), [
  body('name_en').trim().notEmpty().withMessage('English name required'),
  body('name_ar').trim().notEmpty().withMessage('Arabic name required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const image = req.file ? req.file.path : '';
    const agent = await Agent.create({ ...req.body, image });
    res.status(201).json(agent);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    if (req.file) {
      await deleteFromCloudinary(agent.image);
      req.body.image = req.file.path;
    }

    Object.assign(agent, req.body);
    await agent.save();
    res.json(agent);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    await deleteFromCloudinary(agent.image);
    res.json({ message: 'Agent deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
