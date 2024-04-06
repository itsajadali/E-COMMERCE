const express = require("express");
const productService = require("../controller/productService");
const validation = require("../utils/validators/productVal");

const router = express.Router();
const authController = require("../controller/authController");

router
  .route("/")
  .get(productService.getProducts)
  .post(
    authController.protects,
    authController.restrictTo("admin"),
    productService.uploadProductImage,
    productService.resizeImages,
    validation.createCategoryVal,
    productService.createProduct
  );

router
  .route("/:id")
  .get(productService.getProduct)
  .patch(
    authController.protects,
    authController.restrictTo("admin"),
    productService.uploadProductImage,
    productService.resizeImages,
    productService.updateProduct
  )
  .delete(
    authController.protects,
    authController.restrictTo("admin"),
    productService.deleteProduct
  );

module.exports = router;
