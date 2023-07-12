const UrlService = require("../urls/url-service");
const MonitoringWorker = require("./monitoring-worker");

class MonitoringWorkersManager {
  constructor() {
    this.workersPool = new Map();
  }

  static getInstance() {
    if (!MonitoringWorkersManager.instance) {
      MonitoringWorkersManager.instance = new MonitoringWorkersManager();
    }
    return MonitoringWorkersManager.instance;
  }

  createWorker(url) {
    const monitoringWorker = new MonitoringWorker(url);
    if (url.port) {
      monitoringWorker.setPort(url);
    }
    if (url.authentication) {
      monitoringWorker.setAuthentication(url);
    }
    if (url.httpHeaders) {
      monitoringWorker.setHeaders(url);
    }
    if (url.path) {
      monitoringWorker.setPath(url);
    }
    monitoringWorker.createAxiosInstance();
    return monitoringWorker;
  }

  addNewWorkerToPool(url) {
    const monitoringWorker = this.createWorker(url).start();
    this.workersPool.set(url.name, monitoringWorker);
    console.log(this.workersPool);
  }

  async initWorkers() {
    const urls = await UrlService.getUrls();
    if (!urls) {
      console.log("No Urls to check");
      return;
    }
    for (const url of urls) {
      this.addNewWorkerToPool(url);
    }
    console.log(this.workersPool);
  }

  deleteWorker(name) {
    console.log(name);
    const monitoringWorker = this.workersPool.get(name);
    console.log(monitoringWorker);
    monitoringWorker.stop();
    return this.workersPool.delete(name);
  }

  updateWorker(oldUrlName, url) {
    this.deleteWorker(oldUrlName);
    this.addNewWorkerToPool(url);
  }
}

module.exports = MonitoringWorkersManager;