const Joi = require("joi");
const UserService = require("./user-service");
const { removeQuotes } = require("../../helpers/common-functions");
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../../constants/response");

class UserValidator {
  static async signup(req, res, next) {
    const user = req.body;
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const userSignupValidation = schema.validate(user);
    if (userSignupValidation.error) {
      const errorMessage = removeQuotes(
        userSignupValidation.error.details[0].message
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: errorMessage,
      });
    }
    const userExists = await UserService.getUser(user.email);
    if (userExists) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: RESPONSE_MESSAGES.DUPLICATE_USER,
      });
    }
    next();
  }

  static async login(req, res, next) {
    const user = req.body;
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const userSignupValidation = schema.validate(user);
    if (userSignupValidation.error) {
      const errorMessage = removeQuotes(
        userSignupValidation.error.details[0].message
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: errorMessage,
      });
    }
    const existingUser = await UserService.getUser(user.email);
    if (!existingUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.UNAUTHENTICATED_USER,
      });
    }
    if (!existingUser.verified) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.UNVERIFIED_USER,
      });
    }
    // pass database results to the controller
    req.dbUser = existingUser;
    next();
  }

  static async verifyEmail(req, res, next) {
    const user = req.body;
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      verificationCode: Joi.string().required(),
    });
    const userSignupValidation = schema.validate(user);
    if (userSignupValidation.error) {
      const errorMessage = removeQuotes(
        userSignupValidation.error.details[0].message
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: errorMessage,
      });
    }
    const existingUser = await UserService.getUser(user.email);
    if (!existingUser) {
      return res.status(HTTP_STATUS.UNAUTHENTICATED_USER).json({
        message: RESPONSE_MESSAGES.UNAUTHENTICATED_USER,
      });
    }
    if (existingUser.verified) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: RESPONSE_MESSAGES.VERIFIED_USER,
      });
    }
    if (existingUser.verificationCode !== user.verificationCode) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: RESPONSE_MESSAGES.WRONG_CODE,
      });
    }
    next();
  }
}

module.exports = UserValidator;
