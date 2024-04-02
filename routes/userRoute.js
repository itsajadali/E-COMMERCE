const express = require("express");

const userController = require("../controller/userService");
const authController = require("../controller/authController");

const validation = require("../utils/validators/userVal");

const router = express.Router();

router.route("/").get(userController.getUsers);

router.route("/:id").get(validation.idValidation, userController.getUser);

router.route("/signup").post(validation.signupVal, authController.signingUp);
router.route("/login").post(validation.loginVal, authController.loginIn);

router
  .route("/updatePassword")
  .patch(
    validation.updatePasswordVal,
    authController.protects,
    authController.updatePassword
  );

module.exports = router;
