const mongoose = require("mongoose");

const featuredSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
});

module.exports = mongoose.model("Feature", featuredSchema);
