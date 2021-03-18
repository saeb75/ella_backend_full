const image = require("../Models/image");

exports.addImage = (req, res) => {
  let newImage;
  if (req.file) {
    newImage = `${process.env.API_URL}/public/${req.file.filename}`;
  }

  let addImage = new image({ image: newImage });
  addImage.save((err, _image) => {
    if (err) return res.status(400).json(err);
    if (_image) {
      return res.json({ success: true, imageUrl: _image });
    }
  });
};

exports.getImage = async (req, res) => {
  let PAGE_SIZE = 18;
  let page = parseInt(req.query.page) || "1";
  let total = await image.countDocuments({});
  image
    .find({})
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * (page - 1))
    .exec((err, _images) => {
      if (err) throw err;
      if (_images) {
        return res.json({
          success: true,
          _images,
          totalPage: Math.ceil(total / PAGE_SIZE),
        });
      }
    });
};
