const { default: axios } = require("axios");
const https = require("https");
const UrlService = require("../urls/url-service");
const AlertFactory = require("../alerts/alert-factory");
const alertEventEmitter = require("../alerts/alert-event-emitter");
const { addDurationToAxiosInstance } = require("../../helpers/axios");

class MonitoringWorker {
  constructor({
    name,
    url,
    protocol,
    threshold,
    timeout,
    interval,
    ignoreSSL,
  }) {
    this.name = name;
    this.url = url;
    this.protocol = protocol;
    this.ignoreSSL = ignoreSSL;
    this.threshold = threshold;
    this.timeout = timeout * 1000; // 1000 ms is 1 second
    this.interval = interval * 60000; // 60000 ms is 1 minute
    this.failureCounter = 0;
  }
  setPort({ port }) {
    this.port = port;
    return this;
  }
  setAuthentication({ username, password }) {
    this.auth = {
      username,
      password,
    };
    return this;
  }
  setHeaders({ headers }) {
    this.headers = headers;
    return this;
  }
  setPath({ path }) {
    this.path = path;
    return this;
  }
  addAlerts({ alerts }) {
    const alertFactory = new AlertFactory();
    for (const alert of alerts) {
      this.alerts.push(alertFactory.createAlert(alert.type, alert.config));
    }
    return this;
  }
  #createBaseURL() {
    this.baseURL = `${this.protocol}://${this.url}`;
    if (this.port) {
      this.baseURL.concat(`:${port}`);
    }
    if (this.path) {
      this.baseURL.concat(`${path}`);
    }
  }

  createAxiosInstance() {
    this.#createBaseURL();
    const requestConfig = {
      baseURL: this.baseURL,
      timeout: this.timeout,
    };
    if (this.headers) {
      requestConfig.headers = this.headers;
    }
    if (this.auth) {
      requestConfig.auth = auth;
    }
    if (this.ignoreSSL) {
      requestConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    this.instance = axios.create(requestConfig);
    addDurationToAxiosInstance(this.instance);
    return this;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.instance
        .get(this.baseURL, this.requestConfig)
        .then(async (response) => this.calculateMetrics(response, true))
        .catch(async (error) => this.calculateMetrics(error, false));
    }, this.interval);
    return this;
  }

  stop() {
    clearInterval(this.intervalId);
  }

  async calculateMetrics(response, status) {
    const updateMetricsObject = {
      "report.status": status,
      $inc: {
        "report.requestCount": 1,
        "report.totalResponseTime": parseInt(response.duration),
      },
      $push: {
        "report.history": new Date(),
      },
    };

    if (!status) {
      updateMetricsObject["$inc"] = {
        ...updateMetricsObject["$inc"],
        "report.outages": 1,
        "report.downtime": parseInt(this.interval),
      };
      this.failureCounter++;
      if (this.failureCounter > this.threshold) {
        alertEventEmitter.emit("notification", this.name, this.alerts);
      }
    } else {
      updateMetricsObject["$inc"] = {
        ...updateMetricsObject["$inc"],
        "report.uptime": parseInt(this.interval),
      };
    }

    const result = await UrlService.updateMetrics(
      this.name,
      updateMetricsObject
    );
  }
}

module.exports = MonitoringWorker;
