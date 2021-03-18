const Banner = require("../Models/banner");
exports.addBanner = (req, res) => {
  const { name } = req.body;
  const newBanner = new Banner({ name });
  newBanner.save((err, banner) => {
    if (err) return res.status(400).json(err);
    if (banner) {
      return res.status(200).json(banner);
    }
  });
};
exports.addBannerInfo = (req, res) => {
  const { data, name } = req.body;

  Banner.findOneAndUpdate(
    { name },
    { banners: data },
    {
      new: true,
    }
  ).exec((err, banner) => {
    if (err) return res.status(400).json(err);
    if (banner) {
      return res.json(banner);
    }
  });
};
exports.getBanner = (req, res) => {
  Banner.find()
    .populate("banners.image")
    .exec((err, banner) => {
      if (err) return res.status(400).json(err);
      let banners = {};
      if (banner) {
        banner.map((item) => {
          banners[item.name] = item;
        });
        return res.json(banners);
      }
    });
};
