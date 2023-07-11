const usersRoute = require("../users/user-route");
const urlsRoute = require("../modules/urls/url-route");
const reportsRoute = require("../modules/reports/report-route");

module.exports = function (app) {
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/urls", urlsRoute);
  // app.use("/api/v1/reports", reportsRoute);
};
