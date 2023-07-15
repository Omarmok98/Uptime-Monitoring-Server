const usersRoute = require("../modules/users/user-route");
const urlsRoute = require("../modules/urls/url-route");

module.exports = function (app) {
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - email
   *         - password
   *       properties:
   *         email:
   *           type: string
   *           format: email
   *           description: User's email address
   *         password:
   *           type: string
   *           description: User's password
   */
  app.use("/api/v1/users", usersRoute);
  /**
   * @swagger
   * components:
   *   schemas:
   *     Url:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: The name(identifier) for the URL
   *         url:
   *           type: string
   *           description: The URL
   *         protocol:
   *           type: string
   *           enum: [HTTP, HTTPS, TCP]
   *           description: The protocol used for the URL
   *         path:
   *           type: string
   *           description: The path of the URL
   *         port:
   *           type: number
   *           description: The port number
   *         webhook:
   *           type: string
   *           description: The webhook URL
   *         timeout:
   *           type: number
   *           description: The timeout value
   *         interval:
   *           type: number
   *           description: The interval value
   *         threshold:
   *           type: number
   *           description: The threshold value
   *         username:
   *           type: string
   *           description: The username
   *         password:
   *           type: string
   *           description: The password
   *         httpHeaders:
   *           type: object
   *           description: HTTP headers
   *         statusCode:
   *           type: number
   *           description: The status code
   *         tags:
   *           type: array
   *           items:
   *             type: string
   *           description: Tags associated with the URL
   *         ignoreSSL:
   *           type: boolean
   *           description: Indicates whether to ignore SSL
   *         alerts:
   *           type: array
   *           items:
   *             type: object
   *           description: Alerts associated with the URL
   *       required:
   *         - url
   *         - protocol
   *         - ignoreSSL
   *         - name
   *       additionalProperties: false
   */
  app.use("/api/v1/urls", urlsRoute);
};
