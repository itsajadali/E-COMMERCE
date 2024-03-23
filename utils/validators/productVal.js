const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.idValidation = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validationMiddleware,
];

exports.createCategoryVal = [
  check("title")
    .notEmpty()
    .withMessage("product title required")
    .isLength({ min: 4 })
    .withMessage("title must be above 3 char")
    .isLength({ max: 32 })
    .withMessage("name must be below 32"),
  check("description")
    .notEmpty()
    .withMessage("product description required")
    .isLength({ min: 20 })
    .withMessage("description must be above 20 char"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity required")
    .isNumeric()
    .withMessage("quantity must be number"),
  check("sold").optional().isNumeric().withMessage("sold must be number"),

  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be number"),

  check("priceDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("priceDiscount must be number")
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("priceDiscount must be less than price");
      }
      return true;
    }),
  check("availableColors").optional().isArray().withMessage("invalid colors"),

  check("imageCover").notEmpty().withMessage("imageCover required"),
  check("images").optional().isArray().withMessage("invalid images"),
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
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalid subCategory")
    .custom(async (value) => {
      const subCategory = await SubCategory.find({
        _id: { $exists: true, $in: value }, // ! check if subcategory exists in subcategories array
      });
      if (subCategory.length !== value.length || subCategory.length < 1) {
        throw new Error("invalid subCategory");
      }
      return true;
    }),

  check("brand").optional().isMongoId().withMessage("invalid brand"),
  check("ratingsAverage").optional().isNumeric().withMessage("invalid rating"),
  check("ratingsQuantity").optional().isNumeric().withMessage("invalid rating"),
  validationMiddleware,
];
