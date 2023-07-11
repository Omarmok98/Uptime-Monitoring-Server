const jwt = require("jsonwebtoken");
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../constants/response");

module.exports = function (req, res, next) {
  let token = req.headers["x-auth-token"] || req.headers["authorization"];
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (!token) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: RESPONSE_MESSAGES.UNAUTHENTICATED_USER });
  }
  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .send({ message: RESPONSE_MESSAGES.UNAUTHENTICATED_USER });
    }
    req.user = user;
    next();
  });
};
