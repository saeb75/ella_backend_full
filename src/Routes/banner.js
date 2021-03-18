const express = require("express");
const {
  addBanner,
  getBanner,
  addBannerInfo,
} = require("../Controllers/bannerController");

const router = express.Router();
router.post("/banner/add", addBannerInfo);
router.get("/banner/get", getBanner);

module.exports = router;
