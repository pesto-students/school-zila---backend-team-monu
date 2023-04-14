const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    subject_id: {
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
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"class",
      required:true,
    },
    subject_name: {type: String, required:true},
    subject_docs:[
      {
        date:Date,
        imgUrl:String, 
      }
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("course", userSchema);