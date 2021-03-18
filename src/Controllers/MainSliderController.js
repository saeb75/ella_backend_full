const Slider = require("../Models/mainSlider");

exports.addSlider = (req, res) => {
  const { name } = req.body;
  const mainSlider = new Slider({ name });
  mainSlider.save((err, slider) => {
    if (err) return res.status(400).json(err);
    if (slider) {
      return res.status(200).json(slider);
    }
  });
};

exports.addSlide = (req, res) => {
  const { data } = req.body;

  Slider.findOneAndUpdate(
    { name: "mainSlider" },
    { slides: data },
    {
      new: true,
    }
  ).exec((err, slider) => {
    if (err) return res.status(400).json(err);
    if (slider) {
      return res.json(slider);
    }
  });
};
exports.getSlides = (req, res) => {
  console.log("saeb");
  Slider.findOne({ name: "mainSlider" })
    .populate("slides.image")
    .exec((err, slider) => {
      if (err) return res.status(400).json(err);
      if (slider) {
        return res.status(200).json(slider);
      }
    });
};
