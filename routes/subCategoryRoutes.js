const express = require("express");
const subCategoryService = require("../controller/subcategoryService");

// handling params
const validation = require("../utils/validators/subCategoryVal");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
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
  .patch(validation.idValidation, subCategoryService.updateSubCategory)
  .delete(validation.idValidation, subCategoryService.deleteSubCategory);

module.exports = router;
