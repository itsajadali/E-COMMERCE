const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.idValidation = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validationMiddleware,
];

exports.postSubCategoryVal = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 2 })
    .withMessage("name must be above 2 char")
    .isLength({ max: 32 })
    .withMessage("name must be below 32"),
  check("category")
    .notEmpty()
    .withMessage("category name need to be provided")
    .isMongoId()
    .withMessage("sub category must belong to a category")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("invalid category");
      }
      return true;
    }),
  validationMiddleware,
];
