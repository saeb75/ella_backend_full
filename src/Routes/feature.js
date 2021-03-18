const express = require("express");
const router = express.Router();
const {
  addFeature,
  addToDiscount,
  removeProductFromDiscount,
  getDiscountList,
} = require("../Controllers/featureController");
router.post("/feature/add", addFeature);
router.post("/feature/discount/add", addToDiscount);
router.post("/feature/discount/remove", removeProductFromDiscount);
router.get("/feature/discount/get", getDiscountList);
module.exports = router;
