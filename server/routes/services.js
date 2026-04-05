const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
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

// Build sections array from parsed meta + uploaded files
const buildSections = (sectionsMeta, files) => {
  const sectionFiles = {};
  for (const f of files) {
    if (f.fieldname.startsWith('section_img_')) {
      const key = f.fieldname.replace('section_img_', '');
      sectionFiles[key] = f.path;
    }
  }
  return (sectionsMeta || []).map((meta, si) => {
    const newImages = [];
    for (let ii = 0; ii < 3; ii++) {
      const url = sectionFiles[`${si}_${ii}`];
      if (url) newImages.push(url);
    }
    return {
      title_en: meta.title_en || '',
      title_ar: meta.title_ar || '',
      images: [...(meta.keptImages || []), ...newImages].slice(0, 3),
      points: (meta.points || []),
    };
  });
};

// GET /api/services  (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/services/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const s = await Service.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Service not found' });
    res.json(s);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/services
router.post('/', protect, upload.any(), [
  body('title_en').trim().notEmpty().withMessage('English title required'),
  body('title_ar').trim().notEmpty().withMessage('Arabic title required'),
  body('description_en').trim().notEmpty().withMessage('English description required'),
  body('description_ar').trim().notEmpty().withMessage('Arabic description required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const files = req.files || [];
    const heroFile = files.find(f => f.fieldname === 'image');
    const image = heroFile ? heroFile.path : '';

    let sectionsMeta = [];
    if (req.body.sections_meta) {
      try { sectionsMeta = JSON.parse(req.body.sections_meta); } catch {}
    }
    const sections = buildSections(sectionsMeta, files);

    let features = [];
    if (req.body.features) try { features = JSON.parse(req.body.features); } catch {}

    const service = await Service.create({ ...req.body, image, sections, features });
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/services/:id
router.put('/:id', protect, upload.any(), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const files = req.files || [];
    const heroFile = files.find(f => f.fieldname === 'image');

    // Replace hero image if new one uploaded
    if (heroFile) {
      await deleteFromCloudinary(service.image);
      req.body.image = heroFile.path;
    }

    // Handle sections
    let sectionsMeta = null;
    if (req.body.sections_meta !== undefined) {
      try { sectionsMeta = JSON.parse(req.body.sections_meta); } catch {}
    }

    if (sectionsMeta !== null) {
      // Delete images from removed sections
      const keptImages = sectionsMeta.flatMap(s => s.keptImages || []);
      const toDelete = service.sections.flatMap(sec => sec.images).filter(img => !keptImages.includes(img));
      await Promise.all(toDelete.map(deleteFromCloudinary));
      req.body.sections = buildSections(sectionsMeta, files);
    }

    let features = service.features;
    if (req.body.features) try { features = JSON.parse(req.body.features); } catch {}
    req.body.features = features;

    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await deleteFromCloudinary(service.image);
    const sectionImages = (service.sections || []).flatMap(sec => sec.images || []);
    await Promise.all(sectionImages.map(deleteFromCloudinary));

    res.json({ message: 'Service deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
