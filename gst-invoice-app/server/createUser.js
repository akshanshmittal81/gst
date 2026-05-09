const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://akshanshmittal26_db_user:PR4ACPTKrXKlqJlA@gst.cqxiqug.mongodb.net/')
  .then(async () => {
    const user = await User.create({
      name: 'Akshansh',
      email: 'akshanshmittal8@gmail.com',
      password: 'apna_password_yahan',
      role: 'admin'
    });
    console.log('User created:', user);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });