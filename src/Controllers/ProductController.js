const { json } = require("body-parser");
const { default: slugify } = require("slugify");
const { populate } = require("../Models/category");
const category = require("../Models/category");
const product = require("../Models/product");
const Product = require("../Models/product");
const color = require("../Models/color");
exports.addProduct = (req, res) => {
  const {
    name,
    description,
    productDetails,
    category,
    slug,
    color,
    productImg,
    price,
  } = req.body;

  let productImgArray = [];
  if (productImg) {
    productImgArray = productImg.map((item) => {
      return { img: item };
    });
  }
  let productDetailsArray = [];
  if (productDetails) {
    productDetailsArray = productDetails.map((item) => {
      return { size: item.size, quantity: item.quantity };
    });
  }
  let productObj = {
    name,
    slug: slugify(slug),
    description,
    productImg: productImgArray,
    productDetails: productDetailsArray,
    category,
    color,
    price,
  };

  if (req.body.id) {
    Product.findByIdAndUpdate({ _id: req.body.id }, productObj, {
      new: true,
    }).exec((err, UpdatedProduct) => {
      if (err) return err;
      if (UpdatedProduct) {
        return res.json({ UpdatedProduct });
      }
    });
  } else {
    let product = new Product(productObj);
    product.save((err, _product) => {
      if (err) return err;
      if (_product) {
        return res.json(_product);
      }
    });
  }
};

exports.getProducts = async (req, res) => {
  const PAGE_SIZE = 8;
  let page = parseInt(req.query.page) || "1";
  let total = await Product.countDocuments({});
  console.log(Math.ceil(total / PAGE_SIZE));
  await Product.find({})
    .populate("productImg.img")
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * (page - 1))
    .exec((err, _products) => {
      if (err) return err;
      if (_products) {
        return res.json({
          products: _products,
          totalPage: Math.ceil(total / PAGE_SIZE),
        });
      }
    });
};

exports.deleteProduct = (req, res) => {
  let { _id } = req.body;
  product.findOneAndDelete({ _id }).exec((err, product) => {
    if (err) return res.status(400).json(err);
    if (product) {
      return res.json({ success: true });
    }
  });
};

exports.getProductsByCategories = async (req, res) => {
  let { slug } = req.body;

  let categoryId = await category.find({ slug }).select("_id");
  if (categoryId[0]) {
    let filterObj = {};
    filterObj.category = categoryId[0]._id;

    if (req.body.color) {
      let colorId = await color.find({ enName: req.body.color });
      if (colorId[0]) {
        filterObj.color = colorId[0]._id;
      }
    }
    if (req.body.size) {
      filterObj.productDetails = { $elemMatch: { size: req.body.size } };
    }
    console.log(filterObj);
    Product.find(filterObj)
      .populate("category productImg.img color")
      .exec((err, products) => {
        if (err) return res.status(400).json(err);
        if (products) {
          return res.status(200).json({ products });
        }
      });
  } else {
    return res.status(404).json({ msg: "not found this slug" });
  }
};

exports.getProductsDetails = async (req, res) => {
  let { slug } = req.body;
  console.log(slug);
  let categoryId = await category.find(slug).select("_id");
  if (categoryId[0]) {
    Product.find({ category: categoryId[0]._id })
      .populate("category productImg.img color")
      .exec((err, products) => {
        if (err) return res.status(400).json(err);
        if (products) {
          return res.status(200).json({ products });
        }
      });
  } else {
    return res.status(404).json({ msg: "not found this slug" });
  }
};

exports.getProduct = (req, res) => {
  let { slug } = req.body;
  Product.find({ slug })
    .populate("color category productImg.img")
    .exec((err, product) => {
      if (err) return err;
      if (product) {
        return res.json({ success: true, product });
      }
      return res.status(404).json({});
    });
};

exports.getProductsBySort = (req, res) => {
  let sort = req.query.sort ? req.query.sort : "createdAt";
  let order = req.query.order ? req.query.order : "desc";
  console.log({ sort, order });
  product
    .find({})
    .sort([[sort, order]])
    .populate("productImg.img")
    .exec((err, products) => {
      if (err) return res.status(400).json(err);
      if (products) {
        return res.json({
          success: true,
          products,
          sort: sort,
          orderBy: order,
        });
      }
    });
};
