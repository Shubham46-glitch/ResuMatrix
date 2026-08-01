const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const AnalysisReport = require('./models/AnalysisReport');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connected to DB');

    const users = await User.find({});
    console.log(`Found ${users.length} users.`);

    for (const user of users) {
      const reports = await AnalysisReport.find({ user: user._id });
      console.log(`User ${user.email} has ${reports.length} reports.`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
