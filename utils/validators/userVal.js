const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.idValidation = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validationMiddleware,
];
exports.signupVal = [
  check("name").notEmpty().withMessage("name required"),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) return true;

      throw new Error("email already exists");
    }),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be above 6 char"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password don't match");
      }
      return true;
    }),
  check("phone").optional().isMobilePhone("ar-IQ").withMessage("invalid phone"),

  validationMiddleware,
];

exports.loginVal = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({
      min: 6,
    })
    .withMessage("invalid password"),
  validationMiddleware,
];

exports.updatePasswordVal = [
  check("currentPassword").notEmpty().withMessage("password required"),
  check("newPassword").notEmpty().withMessage("new Password required"),
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("confirm Password required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("password don't match");
      }
      return true;
    }),
  validationMiddleware,
];
