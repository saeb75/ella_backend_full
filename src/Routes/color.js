const express = require("express");
const { addColor, getColor } = require("../Controllers/ColorController");
const router = express.Router();
router.post("/color/add", addColor);
router.get("/color/get", getColor);
module.exports = router;
