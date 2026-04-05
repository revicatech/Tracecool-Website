const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  phone: { type: String, default: '' },
  phone2: { type: String, default: '' },
  email: { type: String, default: '' },
  address_en: { type: String, default: '' },
  address_ar: { type: String, default: '' },
  socials: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
