const express = require("express");
const productService = require("../controller/productService");
const validation = require("../utils/validators/productVal");

const router = express.Router();

router
  .route("/")
  .get(productService.getProducts)
  .post(validation.createCategoryVal, productService.createProduct);

router
  .route("/:id")
  .get(productService.getProduct)
  .patch(productService.updateProduct)
  .delete(productService.deleteProduct);

module.exports = router;
