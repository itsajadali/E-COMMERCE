const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");

exports.idValidation = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validationMiddleware,
];

exports.createBrandVal = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 4 })
    .withMessage("name must be above 3 char")
    .isLength({ max: 32 })
    .withMessage("name must be below 32"),
  validationMiddleware,
];


