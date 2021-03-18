const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      min: 2,
      max: 10,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      min: 2,
      max: 10,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    gender: {
      type: String,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    contactNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    resetPaswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hashed_password);
  },
};
module.exports = mongoose.model("User", userSchema);
