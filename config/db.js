require("dotenv").config();
const mongoose = require("mongoose");
require("dotenv").config();
module.exports = () => {
  return mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@schoolzilla.lgo0ght.mongodb.net/schoolzilla`
  );
};
