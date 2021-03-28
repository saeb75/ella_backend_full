const express = require("express");
const {
  addToCart,
  getCartItmes,
  removeItem,
} = require("../Controllers/cartController");
const { TokenControl } = require("../Middelwares/AuthMiddelware");

const router = express.Router();
router.post("/cart/add", TokenControl, addToCart);
router.post("/cart/remove", TokenControl, removeItem);
router.get("/cart/get", TokenControl, getCartItmes);

module.exports = router;
