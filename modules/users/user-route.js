const express = require("express");
const UserValidator = require("./user-validator");
const UserController = require("./user-controller");
const router = express.Router();

router.post("/login", [UserValidator.login], UserController.login);

router.post("/signup", [UserValidator.signup], UserController.signup);

router.post(
  "/email-verification",
  [UserValidator.verifyEmail],
  UserController.verifyEmail
);

module.exports = router;
