const express = require("express");
const authentication = require("../../middlewares/authentication");
const authorization = require("../../middlewares/authorization");
const UrlValidator = require("./url-validator");
const UrlController = require("./url-controller");
const router = express.Router();

router.get("/", [authentication], UrlController.getUrls);

router.get(
  "/:name/report",
  [authentication, authorization],
  UrlController.getReport
);
router.get("/reports", [authentication], UrlController.getReports);

router.get("/tag/:tag/report", [authentication], UrlController.getReportsByTag);

router.get("/:name", [authentication, authorization], UrlController.getUrl);

router.post(
  "/",
  [authentication, UrlValidator.createUrl],
  UrlController.createUrl
);

router.put(
  "/:name",
  [authentication, authorization, UrlValidator.updateUrl],
  UrlController.updateUrl
);

router.delete(
  "/:name",
  [authentication, authorization],
  UrlController.deleteUrl
);

module.exports = router;
