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
  // Map / network fields
  country: { type: String, default: '' },
  region: { type: String, default: '' },
  label: { type: String, default: '' },      // e.g. "HQ", "Regional", "Project"
  type: { type: String, default: '' },       // e.g. "Headquarters", "Regional Office"
  isHQ: { type: Boolean, default: false },
  address: { type: String, default: '' },
  since: { type: String, default: '' },
  team: { type: String, default: '' },
  projects: { type: String, default: '' },
  desc: { type: String, default: '' },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
