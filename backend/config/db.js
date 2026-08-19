const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_URL) {
      console.error('CRITICAL ERROR: MONGO_DB_URL environment variable is not defined!');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB');
});

module.exports = connectDB;

