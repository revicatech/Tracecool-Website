const express = require('express');
const ContactInfo = require('../models/ContactInfo');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/contact-info (public)
router.get('/', async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) info = await ContactInfo.create({});
    res.json(info);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/contact-info
router.put('/', protect, async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = await ContactInfo.create(req.body);
    } else {
      Object.assign(info, req.body);
      await info.save();
    }
    res.json(info);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
