const express = require("express");
const router = express.Router();
const {
  addSlider,
  addSlide,
  getSlides,
} = require("../Controllers/MainSliderController");
router.post("/slider/add", addSlider);
router.post("/slider/slide/add", addSlide);
router.get("/slider/get", getSlides);

module.exports = router;
