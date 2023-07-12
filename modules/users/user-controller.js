const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateRandomNumbers } = require("../../helpers/commonFunctions");
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../../constants/response");
const { sendSignupConfirmation } = require("../../config/mail");
const UserService = require("./user-service");

class UserController {
  static async login(req, res) {
    const { password } = req.body;
    const user = req.dbUser;
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: 86400, // 24 hours
        }
      );
      return res.status(HTTP_STATUS.OK).json({
        message: RESPONSE_MESSAGES.AUTHENTICATED_USER,
        token,
      });
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: RESPONSE_MESSAGES.UNAUTHENTICATED_USER,
    });
  }
  static async signup(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateRandomNumbers(5);
    const userResult = await UserService.createUser({
      email,
      hashedPassword,
      verificationCode,
    });
    if (userResult) {
      sendSignupConfirmation(email, verificationCode);
      return res.status(HTTP_STATUS.CREATED).json({
        message: RESPONSE_MESSAGES.USER_SIGNUP,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: RESPONSE_MESSAGES.USER_CREATION_ERROR,
    });
  }

  static async verifyEmail(req, res) {
    const { email } = req.body;
    const userResult = await UserService.verifyUser(email);
    if (userResult) {
      return res.status(HTTP_STATUS.OK).json({
        message: RESPONSE_MESSAGES.VERIFICATION_SUCCESS,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: RESPONSE_MESSAGES.VERIFICATION_FAIL,
    });
  }
}
module.exports = UserController;
