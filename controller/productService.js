/* eslint-disable import/order */
const Product = require("../models/productModel");
const factory = require("./handlerFactory");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");
const AppError = require("../utils/appError");
const uploadImages = require("../middlewares/uploadImageMiddleware");

const multerStorage = multer.memoryStorage();

exports.uploadProductImage = uploadImages.uploadMixImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImages = asyncHandler(async (req, res, next) => {
  const productsCover = `productCover-${uuid()}-${Date.now()}.jpeg`;
  const filename = `product-${uuid()}-${Date.now()}.jpeg`;

  if (req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/productsCover/${productsCover}`);
    req.body.imageCover = productsCover;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
        await sharp(img.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/productsImages/${i + 1}-${filename}`);

        req.body.images.push(`${i + 1}-${filename}`);
      })
    );
  }
  next();
});
exports.getProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
