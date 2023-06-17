const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: false,
      auto: true,
    },
    school_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"school",
      required:true,
    },
    class_name: {type: String, required:true},
    abbreviation: {type: String, required:false},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("class", userSchema);