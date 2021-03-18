const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

const {
  addProduct,
  getProducts,
  getProductsByCategories,
  deleteProduct,
  getProductsDetails,
  getProduct,
  getBestCategories,
  getProductsBySort,
} = require("../Controllers/ProductController");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname)) + "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/product/add", addProduct);
router.get("/product/get", getProducts);
router.get("/product/sort/get", getProductsBySort);
router.post("/product/delete", deleteProduct);
router.post("/product/by/categories", getProductsByCategories);
router.post("/product/details", getProductsDetails);
router.post("/product/single", getProduct);

module.exports = router;
