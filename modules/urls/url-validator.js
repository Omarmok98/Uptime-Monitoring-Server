const Joi = require("joi");
const UrlService = require("./url-service");
const { RESPONSE_MESSAGES, HTTP_STATUS } = require("../../constants/response");
const { removeQuotes } = require("../../helpers/commonFunctions");

const urlBaseSchema = Joi.object({
  url: Joi.string().required(),
  protocol: Joi.string().valid("HTTP", "HTTPS", "TCP").required(),
  path: Joi.string(),
  port: Joi.number(),
  webhook: Joi.string(),
  timeout: Joi.number(),
  interval: Joi.number(),
  threshold: Joi.number(),
  username: Joi.string(),
  password: Joi.string(),
  httpHeaders: Joi.object(),
  statusCode: Joi.number(),
  tags: Joi.array().items(Joi.string()),
  ignoreSSL: Joi.boolean().required(),
  alerts: Joi.array().items(Joi.object()).optional(),
});

class UrlValidator {
  static async createUrl(req, res, next) {
    const url = req.body;
    const urlSchema = urlBaseSchema.append({ name: Joi.string().required() });
    const urlValiation = urlSchema.validate(url);
    if (urlValiation.error) {
      const errorMessage = removeQuotes(urlValiation.error.details[0].message);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: errorMessage,
      });
    }
    const urlExists = await UrlService.getUrl(url.name);
    if (urlExists) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: RESPONSE_MESSAGES.DUPLICATE_URL,
      });
    }
    next();
  }

  static async updateUrl(req, res, next) {
    const url = req.body;
    const urlSchema = urlBaseSchema.append({ name: Joi.string().optional() });
    const urlValiation = urlSchema.validate(url);
    if (urlValiation.error) {
      const errorMessage = removeQuotes(urlValiation.error.details[0].message);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: RESPONSE_MESSAGES.VALIDATION_FAILURE,
        message: errorMessage,
      });
    }
    next();
  }
}

module.exports = UrlValidator;
