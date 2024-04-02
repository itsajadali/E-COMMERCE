const express = require("express");
const productService = require("../controller/productService");
const validation = require("../utils/validators/productVal");

const router = express.Router();

router
  .route("/")
  .get(productService.getProducts)
  .post(
    productService.uploadProductImage,
    productService.resizeImages,
    validation.createCategoryVal,
    productService.createProduct
  );

router
  .route("/:id")
  .get(productService.getProduct)
  .patch(
    productService.uploadProductImage,
    productService.resizeImages,
    productService.updateProduct
  )
  .delete(productService.deleteProduct);

module.exports = router;
