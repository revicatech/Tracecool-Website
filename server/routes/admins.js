const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect, superAdminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect, superAdminOnly);

// GET /api/admins — hidden admins are never exposed
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find({ hidden: { $ne: true } }).select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admins
router.post('/', [
  body('username').trim().notEmpty().isLength({ min: 3 }),
  body('name').trim().notEmpty(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['superadmin', 'admin']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const { username, name, password, role } = req.body;
    const exists = await Admin.findOne({ username: username.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Username already exists' });

    const admin = await Admin.create({ username, name, password, role });
    res.status(201).json({ _id: admin._id, username: admin.username, name: admin.name, role: admin.role, createdAt: admin.createdAt });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admins/:id
router.put('/:id', [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('name').optional().trim().notEmpty(),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['superadmin', 'admin']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.hidden) return res.status(403).json({ message: 'Admin not found' });

    const { username, name, password, role } = req.body;

    if (username && username.toLowerCase() !== admin.username) {
      const taken = await Admin.findOne({ username: username.toLowerCase(), _id: { $ne: admin._id } });
      if (taken) return res.status(409).json({ message: 'Username already taken' });
      admin.username = username.toLowerCase();
    }
    if (name) admin.name = name;
    if (role) admin.role = role;
    if (password) admin.password = password; // hashed in pre-save

    await admin.save();
    res.json({ _id: admin._id, username: admin.username, name: admin.name, role: admin.role, createdAt: admin.createdAt });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admins/:id
router.delete('/:id', async (req, res) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'Admin not found' });
    if (target.hidden) return res.status(403).json({ message: 'Admin not found' });
    await target.deleteOne();
    res.json({ message: 'Admin deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
