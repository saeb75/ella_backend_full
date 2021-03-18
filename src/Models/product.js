const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
    productDetails: [
      {
        size: { type: String },
        quantity: { type: String },
      },
    ],
    productImg: [
      {
        img: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Image",
        },
      },
    ],
    discount: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sold: {
      type: Number,
      default: 0,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
