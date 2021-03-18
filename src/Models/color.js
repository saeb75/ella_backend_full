const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    enName: {
      type: String,
      required: true,
      unique: true,
    },
    prName: { type: String, required: true, unique: true },
    code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", colorSchema);
