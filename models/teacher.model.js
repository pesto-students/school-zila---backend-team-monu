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
    teacherName: { type: String, required: true },
    teacherPhoto: { type: String, required: false },
    teacherAddress: { type: String, required: false },
    teacherEmail: { type: String, required: true },
    teacherPassword: { type: String, required: true },
    classIds: { type: String, required: false },
    attendenceId: { type: String, required: false },
    teacherSpecilization: { type: String, required: true },
    teacherPhone: { type: Number, required: true },
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
