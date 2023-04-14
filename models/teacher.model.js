const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      auto: true,
    },
    school_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"school",
      required:true,
    },
    teacher_name: { type: String, required: true },
    teacher_profile_pic: { type: String, required: false },
    teacher_address: { type: String, required: false },
    teacher_email: { type: String, required: true },
    teacher_password: { type: String, required: true },
    class_ids:{type: String, required: false},
    attendence_id:{type: String, required: false},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.methods.checkPassword = function (teacher_password) {
  const hashedPassword = this.teacher_password;
  return bcrypt.compareSync(teacher_password, this.teacher_password);
};
userSchema.pre("save", function (next) {
  if (!this.isModified("teacher_password")) return next();
  this.teacher_password = bcrypt.hashSync(this.teacher_password, 8);
  return next();
});
module.exports = mongoose.model("teachers", userSchema);