const { default: axios } = require("axios");
const https = require("https");

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
    return this;
  }

  start() {
    console.log(this.baseURL);
    this.intervalId = setInterval(() => {
      this.instance
        .get(this.baseURL, this.requestConfig)
        .then(async (response) => this.calculateMetrics(response))
        .catch((error) => console.log(error));
    }, this.interval);
    return this;
  }

  stop() {
    clearInterval(this.intervalId);
  }

  async calculateMetrics(response) {
    console.log("collecting metrics ", this);
  }
}

module.exports = MonitoringWorker;
