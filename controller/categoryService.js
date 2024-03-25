/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uuid } = require("uuidv4");

const factory = require("./handlerFactory");
const Category = require("../models/categoryModel");

const uploadImages = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = uploadImages.uploadOneImage("image");

exports.resizeImages = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  const filename = `category-${uuid()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;
  next();
});

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
