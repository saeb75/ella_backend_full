const { json } = require("body-parser");
const { default: slugify } = require("slugify");
const category = require("../Models/category");
const product = require("../Models/product");

exports.addCategory = async (req, res) => {
  const { _id, name, slug, parentId, categoryImg } = req.body;

  let setUpdated = { name, slug, categoryImg };
  let unSetUpdated = {};
  if (parentId) {
    setUpdated.parentId = parentId;
  } else {
    unSetUpdated.parentId = "";
  }

  if (_id) {
    let updatedCategory = await category.findByIdAndUpdate(
      { _id },
      {
        $set: setUpdated,
        $unset: unSetUpdated,
      },
      { new: true, upsert: true }
    );
    if (updatedCategory) {
      return res.json({
        success: true,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } else {
    const categoryObj = {
      name: req.body.name,
      slug: slugify(req.body.slug),
      categoryImg,
    };

    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }

    const mycategory = await new category(categoryObj);
    mycategory.save((err, _category) => {
      if (err) return res.json(err);
      if (_category) {
        res.json({
          success: true,
          _category,
        });
      }
    });
  }
};

exports.getCategoreis = (req, res) => {
  category
    .find({})
    .populate("parentId")
    .populate("categoryImg")
    .exec(async (err, categories) => {
      if (err) return err;
      if (categories) {
        let allCategories = getListOfCategories(categories);
        res.json({
          success: true,
          allCategories,
        });
      }
    });
};

let getListOfCategories = (categories, parentId) => {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => {
      return cat.parentId && cat.parentId._id.toString() == parentId.toString();
    });
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      categoryImg: cate.categoryImg,
      parentId: cate.parentId,
      type: cate.type,
      children: getListOfCategories(categories, cate._id),
    });
  }

  return categoryList;
};

exports.getListCategory = (req, res) => {
  category
    .find({})
    .populate("parentId", "name")
    .populate("categoryImg")
    .exec((err, Allcategory) => {
      if (err) return res.status(400).json(err);
      if (Allcategory) {
        return res.json({
          success: true,
          categories: Allcategory,
        });
      }
    });
};

exports.deleteCategory = (req, res) => {
  const { _id } = req.body;
  category.findByIdAndDelete({ _id }).exec((err, deleted) => {
    if (err) return res.status(400).json({ success: false });
    if (deleted) {
      return res.json({
        success: true,
      });
    }
  });
};
exports.getBestCategories = (req, res) => {
  product.find({}).exec((err, _product) => {
    if (err) return res.status(400).json(err);
    let categoryObj = {};
    if (_product) {
      _product.map((item) => {
        categoryObj[item.category] =
          categoryObj[item.category] + item.sold || item.sold;
      });
      const sortable = Object.entries(categoryObj).sort((a, b) => b[1] - a[1]);

      let findArray = [];
      sortable.slice(0, 6).map((item) => {
        findArray.push({
          _id: item[0],
        });
      });

      category.find({ $or: findArray }).exec((err, _categories) => {
        if (err) return res.status(400).json(err);
        if (_categories) {
          return res.status(200).json(_categories);
        }
      });
    }
  });
};
