const express = require("express");
const categoryService = require("../controller/categoryService");

// handling params
const validation = require("../utils/validators/categoryVal");
const subCategoryRouter = require("./subCategoryRoutes");

const router = express.Router();

router.use("/:categoryId/subcategory", subCategoryRouter);
router
  .route("/")
  .get(categoryService.getCategories)
  .post(validation.createCategoryVal, categoryService.createCategory);

router
  .route("/:id")
  .get(validation.idValidation, categoryService.getCategory)
  .patch(validation.idValidation, categoryService.updateCategory)
  .delete(validation.idValidation, categoryService.deleteCategory);

module.exports = router;
