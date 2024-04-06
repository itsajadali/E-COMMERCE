const express = require("express");
const categoryService = require("../controller/categoryService");

// handling params
const validation = require("../utils/validators/categoryVal");
const subCategoryRouter = require("./subCategoryRoutes");

const authController = require("../controller/authController");

const router = express.Router();

router.use("/:categoryId/subcategory", subCategoryRouter);

router
  .route("/")
  .get(authController.protects, categoryService.getCategories)
  .post(
    authController.protects,
    authController.restrictTo("admin"),
    categoryService.uploadCategoryImage,
    categoryService.resizeImages,
    validation.createCategoryVal,
    categoryService.createCategory
  );

router
  .route("/:id")
  .get(validation.idValidation, categoryService.getCategory)
  .patch(
    authController.protects,
    authController.restrictTo("admin"),
    categoryService.uploadCategoryImage,
    categoryService.resizeImages,
    validation.idValidation,
    categoryService.updateCategory
  )
  .delete(
    authController.protects,
    authController.restrictTo("admin"),
    validation.idValidation,
    categoryService.deleteCategory
  );

module.exports = router;
