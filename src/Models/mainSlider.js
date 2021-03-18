const mongoose = require("mongoose");

const SliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slides: [
    {
      image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
      link: {
        type: String,
      },
      category: {
        type: String,
      },
      infoTitle: {
        type: String,
      },
      infoDesc: {
        type: String,
      },
      infoLocation: {
        type: String,
      },
      button: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Slider", SliderSchema);
