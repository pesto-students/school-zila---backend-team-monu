const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      auto: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true,
    },
    teacher_name: { type: String, required: true },
    teacher_profile_pic: { type: String, required: false },
    teacher_address: { type: String, required: false },
    teacher_phone: { type: String, required: true },
    teacher_specialization: { type: String, required: true },
    teacher_dob: { type: String, required: true },
    teacher_university: { type: String, required: false },
    teacher_degree: { type: String, required: true },
    teacher_city: { type: String, required: true },
    teacher_email: { type: String, required: true },
    teacher_password: { type: String, required: true },
    class_ids: { type: String, required: false },
    attendence_id: { type: String, required: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.methods.checkPassword = function (teacherPassword) {
  const hashedPassword = this.teacherPassword;
  return bcrypt.compareSync(teacherPassword, this.teacherPassword);
};
userSchema.pre("save", function (next) {
  if (!this.isModified("teacherPassword")) return next();
  this.teacherPassword = bcrypt.hashSync(this.teacherPassword, 8);
  return next();
});
module.exports = mongoose.model("teachers", userSchema);
