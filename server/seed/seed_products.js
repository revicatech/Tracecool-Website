require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const path = require('path');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const data = require('../../products-data3.json');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // 1. Upsert Category
  let category = await Category.findOne({ name_en: data.category.name_en });
  if (!category) {
    category = await Category.create({
      name_en: data.category.name_en,
      name_ar: data.category.name_ar,
    });
    console.log(`Created category: ${category.name_en}`);
  } else {
    console.log(`Category already exists: ${category.name_en}`);
  }

  // 2. Upsert Subcategories — build refKey → ObjectId map
  const subcatMap = {};
  for (const sub of data.subcategories) {
    let subcat = await Subcategory.findOne({ name_en: sub.name_en, category: category._id });
    if (!subcat) {
      subcat = await Subcategory.create({
        name_en: sub.name_en,
        name_ar: sub.name_ar,
        category: category._id,
      });
      console.log(`  Created subcategory: ${subcat.name_en}`);
    } else {
      console.log(`  Subcategory already exists: ${subcat.name_en}`);
    }
    subcatMap[sub._refKey] = subcat._id;
  }

  // 3. Upsert Products
  let created = 0, skipped = 0;
  for (const p of data.products) {
    const exists = await Product.findOne({ title_en: p.title_en });
    if (exists) {
      console.log(`  Product already exists — skipped: ${p.title_en}`);
      skipped++;
      continue;
    }

    // Map {key_en, key_ar, value_en, value_ar} → {feature_en, feature_ar}
    const features = (p.features || []).map(f => ({
      feature_en: `${f.key_en}: ${f.value_en}`,
      feature_ar: `${f.key_ar}: ${f.value_ar}`,
    }));

    await Product.create({
      title_en: p.title_en,
      title_ar: p.title_ar,
      shortDesc_en: p.shortDesc_en || '',
      shortDesc_ar: p.shortDesc_ar || '',
      description_en: p.description_en,
      description_ar: p.description_ar,
      category: category._id,
      subcategory: subcatMap[p.subcategory_ref] || null,
      images: p.images || [],
      features,
      isActive: p.isActive !== undefined ? p.isActive : true,
      order: p.order || 0,
    });
    console.log(`  Created product: ${p.title_en}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
