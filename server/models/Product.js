const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  feature_en: { type: String, required: true },
  feature_ar: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title_en: { type: String, required: true, trim: true },
  title_ar: { type: String, required: true, trim: true },
  description_en: { type: String, required: true },
  description_ar: { type: String, required: true },
  shortDesc_en: { type: String, default: '' },
  shortDesc_ar: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  images: { type: [String], validate: v => v.length <= 10 },
  features: { type: [featureSchema], default: [] },
  catalogPdf: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
