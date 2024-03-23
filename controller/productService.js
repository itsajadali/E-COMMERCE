const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");

exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await Product.find().skip(skip).limit(limit).populate({
    path: "category",
    select: "name -_id",
  });

  res.status(200).json({
    statues: "Success",
    results: products.length,
    page,
    data: products,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  if (!product) {
    return next(new AppError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);

  res.status(201).json({
    statues: "Success",
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!product) {
    return next(new AppError(`No product for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    statues: "Success",
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError(`No product for this id ${req.params.id}`, 404));
  }

  res.status(204).json({ status: "success", data: null });
});
