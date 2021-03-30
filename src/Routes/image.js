const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const { addImage, getImage } = require("../Controllers/imageController");
var multerS3 = require("multer-s3");
var AWS = require("aws-sdk");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname)) + "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

const s3 = new AWS.S3({
  accessKeyId: "f3f39613-785a-4e25-bcd3-a19f27499b5e",
  secretAccessKey:
    "794d9df52652c74e455c04fdc8dc4874595945840c21f19358ee9a83f627636c",
  endpoint: "https://s3.ir-thr-at1.arvanstorage.com",
  s3ForcePathStyle: true,
});
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "saeb-mern-ecommerce",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + "_" + file.originalname);
    },
  }),
});

router.post("/image/add", uploadS3.single("image"), addImage);
router.get("/image/get", getImage);

module.exports = router;
