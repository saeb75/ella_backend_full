const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    categoryImg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
