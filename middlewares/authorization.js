const UrlService = require("../urls/url-service");
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../constants/response");

module.exports = async function (req, res, next) {
  const user = req.user;
  const urlName = req.params.name;
  const url = await UrlService.getUrl(urlName);
  if (!url) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send({ message: RESPONSE_MESSAGES.URL_NOT_EXIST });
  }

  if (user.email != url.email) {
    return res
      .status(HTTP_STATUS.FORBIDDEN)
      .send({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
  }
  next();
};
