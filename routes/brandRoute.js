const express = require("express");
const brandService = require("../controller/brandService");

// handling params
const validation = require("../utils/validators/brandVal");
// const subCategoryRouter = require("./subCategoryRoutes");

const router = express.Router();

// router.use("/:categoryId/subcategory", subCategoryRouter);
router
  .route("/")
  .get(brandService.getBrands)
  .post(
    brandService.uploadBrandImage,
    brandService.resizeImages,
    validation.createCategoryVal,
    brandService.createBrand
  );

router
  .route("/:id")
  .get(validation.idValidation, brandService.getBrand)
  .patch(
    brandService.uploadBrandImage,
    brandService.resizeImages,
    validation.idValidation,
    brandService.updateBrand
  )
  .delete(validation.idValidation, brandService.deleteBrand);

module.exports = router;
