const mongoose = require("mongoose");
require("dotenv").config();

const mongo_db_url = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_db_url);
    console.log("Successfully Connected to mongoose");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;