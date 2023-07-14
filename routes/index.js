const usersRoute = require("../modules/users/user-route");
const urlsRoute = require("../modules/urls/url-route");

module.exports = function (app) {
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/urls", urlsRoute);
};
