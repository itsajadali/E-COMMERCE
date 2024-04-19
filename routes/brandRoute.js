const express = require("express");
const brandService = require("../controller/brandService");

// handling params
const validation = require("../utils/validators/brandVal");
// const subCategoryRouter = require("./subCategoryRoutes");
const authController = require("../controller/authController");

const router = express.Router();

// router.use("/:categoryId/subcategory", subCategoryRouter);

router
  .route("/")
  .get(brandService.getBrands)
  .post(
    authController.protects,
    authController.restrictTo("admin"),
    brandService.uploadBrandImage,
    brandService.resizeImages,
    validation.createBrandVal,
    brandService.createBrand
  );

router
  .route("/:id")
  .get(validation.idValidation, brandService.getBrand)
  .patch(
    authController.protects,
    authController.restrictTo("admin"),
    brandService.uploadBrandImage,
    brandService.resizeImages,
    validation.idValidation,
    brandService.updateBrand
  )
  .delete(
    authController.protects,
    authController.restrictTo("admin"),
    validation.idValidation,
    brandService.deleteBrand
  );

module.exports = router;
