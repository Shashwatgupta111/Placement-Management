const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://gshashwat111:tshashwatagupta111@cluster0.qcegy1i.mongodb.net/placement_management?retryWrites=true&w=majority');

const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

async function run() {
  const users = await User.find({});
  console.log("Users:", users);
  process.exit();
}
run();
