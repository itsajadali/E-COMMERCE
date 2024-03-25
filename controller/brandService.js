/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uuid } = require("uuidv4");

const Brand = require("../models/brandModel");

const factory = require("./handlerFactory");
const uploadImages = require("../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadImages.uploadOneImage("image");

exports.resizeImages = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  const filename = `brand-${uuid()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});
exports.getBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
