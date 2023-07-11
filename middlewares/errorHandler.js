const { HTTP_STATUS } = require("../constants/response");

module.exports = function (err, req, res, next) {
  console.error(err);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
};
