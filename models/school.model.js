const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: false,
      auto: true,
    },
    school_name: { type: String, required: true },
    school_moto: { type: String, required: false },
    school_imgs: { type: String, required: false },
    school_location: { type: String, required: false },
    school_mobile: { type: String, required: false },
    school_email: { type: String, required: true },
    school_password: { type: String, required: true },
    school_uuid : { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.methods.checkPassword = function (school_password) {
  const hashedPassword = this.school_password;
  return bcrypt.compareSync(school_password, this.school_password);
};
userSchema.pre("save", function (next) {
  if (!this.isModified("school_password")) return next();
  this.school_password = bcrypt.hashSync(this.school_password, 8);
  return next();
});
module.exports = mongoose.model("schools", userSchema);