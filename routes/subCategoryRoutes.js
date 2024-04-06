const express = require("express");
const subCategoryService = require("../controller/subcategoryService");

// handling params
const validation = require("../utils/validators/subCategoryVal");

const authController = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protects,
    authController.restrictTo("admin"),
    subCategoryService.setCategoryIdToBody,
    validation.postSubCategoryVal,
    subCategoryService.createSubCategory
  )
  .get(
    subCategoryService.setCategoryIdFilter,
    subCategoryService.getSubCategories
  );

router
  .route("/:id")
  .get(validation.idValidation, subCategoryService.getSubCategory)
  .patch(
    authController.protects,
    authController.restrictTo("admin"),
    validation.idValidation,
    subCategoryService.updateSubCategory
  )
  .delete(
    authController.protects,
    authController.restrictTo("admin"),
    validation.idValidation,
    subCategoryService.deleteSubCategory
  );

module.exports = router;
