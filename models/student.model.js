const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    student_id: {
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
    student_uin:{type:String,required:true},
    student_name: { type: String, required: true },
    student_email: { type: String, required: true },
    student_password: { type: String, required: true },
    student_dob: { type: String, required: true },
    student_mobile: { type: String, required: true },
    student_address: { type: String, required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId,ref:"parent", required: false },
    parent_name: { type: String, required: true },
    parent_relationship: { type: String, required: true },
    parent_email: { type: String, required: true },
    parent_mobile: { type: String, required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId,ref:"subject", required: false },
    class_id: {type: mongoose.Schema.Types.ObjectId,ref:"class",required:false},
    attendence_id: {type: mongoose.Schema.Types.ObjectId,ref:"attendence",required:false},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.methods.checkPassword = function (student_password) {
  const hashedPassword = this.student_password;
  return bcrypt.compareSync(student_password, this.student_password);
};
userSchema.pre("save", function (next) {
  if (!this.isModified("student_password")) return next();
  this.student_password = bcrypt.hashSync(this.student_password, 8);
  return next();
});
module.exports = mongoose.model("students", userSchema);