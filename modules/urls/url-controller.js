const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../../constants/response");
const UrlService = require("./url-service");
const MonitoringWorkersManager = require("../url-monitoring/monitoring-worker-manager");

class UrlController {
  static async createUrl(req, res) {
    const url = req.body;
    const email = req.user.email;
    url.email = email;
    const urlResult = await UrlService.createUrl(url);
    console.log(urlResult);
    if (urlResult) {
      const manager = MonitoringWorkersManager.getInstance();
      manager.addNewWorkerToPool(urlResult);
      return res.status(HTTP_STATUS.CREATED).json({
        message: RESPONSE_MESSAGES.URL_CREATED,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: RESPONSE_MESSAGES.URL_CREATION_ERROR,
    });
  }

  static async getUrls(req, res) {
    const { email } = req.user;
    const urlResult = await UrlService.getUrlsByEmail(email);
    return res.status(HTTP_STATUS.OK).json({
      data: urlResult,
    });
  }

  static async getUrl(req, res) {
    const name = req.params.name;
    const urlResult = await UrlService.getUrl(name);
    return res.status(HTTP_STATUS.OK).json({
      data: urlResult,
    });
  }

  static async deleteUrl(req, res) {
    const name = req.params.name;
    const urlResult = await UrlService.deleteUrl(name);
    console.log(urlResult);
    if (urlResult) {
      const manager = MonitoringWorkersManager.getInstance();
      manager.deleteWorker(name);
      return res.status(HTTP_STATUS.OK).json({
        message: RESPONSE_MESSAGES.URL_DELETED,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: RESPONSE_MESSAGES.URL_DELETION_ERROR,
    });
  }

  static async updateUrl(req, res) {
    const url = req.body;
    const name = req.params.name;
    const email = req.user.email;
    url.email = email;
    const urlResult = await UrlService.updateUrl(name, url);
    console.log(urlResult);
    if (urlResult) {
      const manager = MonitoringWorkersManager.getInstance();
      manager.updateWorker(name, urlResult);
      return res.status(HTTP_STATUS.OK).json({
        message: RESPONSE_MESSAGES.URL_UPDATED,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: RESPONSE_MESSAGES.URL_DELETION_ERROR,
    });
  }
}

module.exports = UrlController;
