const express = require("express");
const UserValidator = require("./user-validator");
const UserController = require("./user-controller");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 * /api/v1/users/login:
 *   post:
 *     summary: Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Failed
 *       401:
 *         description: User authentication failed
 *
 *
 */
router.post("/login", [UserValidator.login], UserController.login);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 * api/v1/users/signup:
 *   post:
 *     summary: SignUp
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created succesfuly, Verification code is sent.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Failed
 *       500:
 *         description: User could not be created. please try again
 *
 *
 */
router.post("/signup", [UserValidator.signup], UserController.signup);

router.post(
  "/email-verification",
  [UserValidator.verifyEmail],
  UserController.verifyEmail
);

module.exports = router;
