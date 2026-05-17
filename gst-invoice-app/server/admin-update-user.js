// Admin script - sirf local run karna, deploy mat karna
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI;

// ✏️ YAHAN APNI DETAILS BHARO
const USER_EMAIL = 'admin@gmail.com';

const UPDATE_DATA = {
  name: 'Aniket Kansal',
  companyName: 'M/s RIDDHI GOODS',
  gstNumber: '09AFBPG7155E1ZM',
  address: 'SECTOR-I, H NO. 215/1, SHASTRI NAGAR ,Ghaziabad UP\nMSME: UDYAM-UP-56-00794118',
  state: 'Uttar Pradesh',
  contact: '+91 98765 43210',
};

async function updateUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const user = await User.findOne({ email: USER_EMAIL });
    if (!user) {
      console.log('❌ User not found:', USER_EMAIL);
      process.exit(1);
    }

    console.log('👤 User found:', user.name, '|', user.email);
    console.log('📝 Updating...');

    Object.assign(user, UPDATE_DATA);
    await user.save();

    console.log('✅ User updated successfully!');
    console.log('Updated data:', UPDATE_DATA);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

updateUser();
