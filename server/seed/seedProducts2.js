require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

const data = require('../../products-data2.json');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // 1. Upsert category
  let category = await Category.findOne({ name_en: data.category.name_en });
  if (!category) {
    category = await Category.create({
      name_en: data.category.name_en,
      name_ar: data.category.name_ar,
      isActive: true,
      order: 0,
    });
    console.log(`Created category: ${category.name_en}`);
  } else {
    console.log(`Category already exists: ${category.name_en}`);
  }

  // 2. Upsert subcategories, build refKey → ObjectId map
  const subcategoryMap = {};
  for (const sub of data.subcategories) {
    let subcategory = await Subcategory.findOne({ name_en: sub.name_en, category: category._id });
    if (!subcategory) {
      subcategory = await Subcategory.create({
        name_en: sub.name_en,
        name_ar: sub.name_ar,
        category: category._id,
        isActive: true,
        order: 0,
      });
      console.log(`Created subcategory: ${subcategory.name_en}`);
    } else {
      console.log(`Subcategory already exists: ${subcategory.name_en}`);
    }
    subcategoryMap[sub._refKey] = subcategory._id;
  }

  // 3. Upsert products
  for (const p of data.products) {
    const subcategoryId = subcategoryMap[p.subcategory_ref];
    if (!subcategoryId) {
      console.warn(`Unknown subcategory_ref "${p.subcategory_ref}" for product "${p.title_en}" — skipped`);
      continue;
    }

    const features = (p.features || []).map(f => ({
      feature_en: `${f.key_en}: ${f.value_en}`,
      feature_ar: `${f.key_ar}: ${f.value_ar}`,
    }));

    const exists = await Product.findOne({ title_en: p.title_en, category: category._id });
    if (exists) {
      console.log(`Product already exists — skipped: ${p.title_en}`);
      continue;
    }

    await Product.create({
      title_en: p.title_en,
      title_ar: p.title_ar,
      shortDesc_en: p.shortDesc_en,
      shortDesc_ar: p.shortDesc_ar,
      description_en: p.description_en,
      description_ar: p.description_ar,
      category: category._id,
      subcategory: subcategoryId,
      images: p.images || [],
      features,
      isActive: p.isActive !== false,
      order: p.order || 0,
    });
    console.log(`Created product [${p.order}]: ${p.title_en}`);
  }

  console.log('\nProduct seed 2 complete.\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
