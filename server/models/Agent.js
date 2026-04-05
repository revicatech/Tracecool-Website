const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name_en: { type: String, required: true, trim: true },
  name_ar: { type: String, required: true, trim: true },
  position_en: { type: String, default: '' },
  position_ar: { type: String, default: '' },
  bio_en: { type: String, default: '' },
  bio_ar: { type: String, default: '' },
  image: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
