const express = require("express");
const {
  register,
  activateAccount,
  signin,
  deleteUser,
  updateUser,
} = require("../../Controllers/admin/authController");
const { TokenControl } = require("../../Middelwares/AuthMiddelware");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/admin/register", register);
router.post("/admin/activate", activateAccount);
router.post("/admin/signin", signin);
router.post("/admin/deleteuser", TokenControl, deleteUser);
router.post(
  "/admin/updateuser",
  TokenControl,
  upload.single("profilePicture"),
  updateUser
);

module.exports = router;
