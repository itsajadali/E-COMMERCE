const SubCategory = require("../models/subCategoryModel");

const factory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.setCategoryIdFilter = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filter = filter;
  next();
};

exports.getSubCategories = factory.getAll(SubCategory);
exports.getSubCategory = factory.getOne(SubCategory);
exports.createSubCategory = factory.createOne(SubCategory);
exports.updateSubCategory = factory.updateOne(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
