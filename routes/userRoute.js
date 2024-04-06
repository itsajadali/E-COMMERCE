const express = require("express");

const userController = require("../controller/userService");
const authController = require("../controller/authController");

const validation = require("../utils/validators/userVal");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protects,
    authController.restrictTo("admin"),
    userController.getUsers
  );

router
  .route("/:id")
  .get(
    authController.protects,
    authController.restrictTo("admin"),
    validation.idValidation,
    userController.getUser
  );

router.route("/signup").post(validation.signupVal, authController.signingUp);
router.route("/login").post(validation.loginVal, authController.loginIn);

router
  .route("/updatePassword")
  .patch(
    validation.updatePasswordVal,
    authController.protects,
    authController.updatePassword
  );

router.route("/forgotPassword").post(authController.forgotPassword);

module.exports = router;
