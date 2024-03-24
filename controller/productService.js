const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const APIfeatures = require("../utils/apifeatures");

exports.getProducts = asyncHandler(async (req, res) => {
  const features = new APIfeatures(Product.find(), req.query)
    .filter()
    .limitsField()
    .search()
    .sort()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    statues: "Success",
    results: products.length,
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
