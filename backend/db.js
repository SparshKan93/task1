// db.js
const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectToMongo;
