const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategoryModel");
const AppError = require("../utils/appError");

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
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subcategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({
    statues: "Success",
    data: subcategory,
  });
});

exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filter)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    statues: "Success",
    results: subCategories.length,
    page,
    data: subCategories,
  });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    return next(new AppError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const subCategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!subCategory) {
    return next(new AppError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({
    statues: "Success",
    data: subCategory,
  });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new AppError(`No category for this id ${id}`, 404));
  }

  res.status(204).json({ status: "success", data: subCategory });
});
