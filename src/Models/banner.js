const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  banners: [
    {
      image: {
        type: String,
        ref: "Image",
      },
      category: { type: String },
      infoTitle: { type: String },
      infoDesc: { type: String },
      link: { type: String },
      button: { type: String },
    },
  ],
});

module.exports = mongoose.model("Banner", bannerSchema);
