const featured = require("../Models/featured");
const Featured = require("../Models/featured");
const product = require("../Models/product");

exports.addFeature = (req, res) => {
  const { name } = req.body;
  const feature = new Featured({ name });
  feature.save((err, _feature) => {
    if (err) return res.status(400).json(err);
    if (_feature) {
      return res.json(_feature);
    }
  });
};

exports.addToDiscount = (req, res) => {
  const { _id, discount, name } = req.body;
  console.log(req.body);
  product
    .findByIdAndUpdate({ _id }, { $set: { discount } }, { new: true })
    .exec(async (err, _product) => {
      if (err) return res.status(400).json(err);
      if (_product) {
        let feturedItems = await featured.findOne({
          name,
          "products.product": _product._id,
        });
        if (feturedItems) {
          featured
            .findOneAndUpdate(
              { name, "products.product": _product._id },
              { $set: { "products.$": { product: _id } } },
              { new: true }
            )
            .populate("products.product")
            .exec((err, done) => {
              if (err) return res.status(400).json(err);
              if (done) {
                return res.json(done);
              }
            });
        } else {
          featured
            .findOneAndUpdate(
              { name },
              { $push: { products: { product: _id } } },
              { new: true }
            )
            .populate("products.product")
            .exec((err, done) => {
              if (err) return res.status(400).json(err);
              if (done) {
                return res.json(done);
              }
            });
        }
      }
    });
};

exports.removeProductFromDiscount = async (req, res) => {
  const { _id, name } = req.body;
  let updatedProduct = await product.findOneAndUpdate(
    { _id },
    { $unset: { discount: "" } }
  );
  featured
    .findOneAndUpdate(
      { name, "products.product": _id },
      { $pull: { products: { product: _id } } }
    )
    .populate("products.product")
    .exec((err, discount) => {
      if (err) return res.status(400).json(err);
      if (discount) {
        return res.status(200).json(discount);
      }
    });
};

exports.getDiscountList = (req, res) => {
  let discount = "discount";
  featured
    .findOne({ name: discount })
    .populate({
      path: "products.product",
      populate: {
        path: "productImg.img",
      },
    })
    .exec((err, list) => {
      if (err) return res.status(400).json(err);
      if (list) {
        return res.json({
          success: true,
          list,
        });
      }
    });
};
