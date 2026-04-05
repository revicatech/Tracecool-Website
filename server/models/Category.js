const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name_en: { type: String, required: true, trim: true },
  name_ar: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (this.isModified('name_en') || !this.slug) {
    this.slug = this.name_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
