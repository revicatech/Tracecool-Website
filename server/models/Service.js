const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  point_en: { type: String, required: true },
  point_ar: { type: String, required: true },
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  title_en: { type: String, default: '' },
  title_ar: { type: String, default: '' },
  images: { type: [String], validate: v => v.length <= 3, default: [] },
  points: { type: [pointSchema], default: [] },
}, { _id: false });

const featureSchema = new mongoose.Schema({
  feature_en: { type: String, required: true },
  feature_ar: { type: String, required: true },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title_en: { type: String, required: true, trim: true },
  title_ar: { type: String, required: true, trim: true },
  description_en: { type: String, required: true },
  description_ar: { type: String, required: true },
  shortDesc_en: { type: String, default: '' },
  shortDesc_ar: { type: String, default: '' },
  image: { type: String, default: '' },      // hero image
  features: { type: [featureSchema], default: [] },
  sections: { type: [sectionSchema], default: [] },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
