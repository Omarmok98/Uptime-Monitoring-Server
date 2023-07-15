const axios = require("axios");
const MonitoringWorker = require("../../modules/url-monitoring/monitoring-worker");
const UrlService = require("../../modules/urls/url-service");
const alertEventEmitter = require("../../modules/alerts/alert-event-emitter");

jest.mock("axios");

describe("MonitoringWorker", () => {
  let monitoringWorker;

  beforeEach(() => {
    monitoringWorker = new MonitoringWorker({
      name: "Test",
      url: "example.com",
      protocol: "http",
      threshold: 3,
      timeout: 5,
      interval: 1,
      ignoreSSL: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setPort", () => {
    it("should set the port property", () => {
      const port = 8080;
      monitoringWorker.setPort({ port });
      expect(monitoringWorker.port).toBe(port);
    });
  });

  describe("setAuthentication", () => {
    it("should set the auth property", () => {
      const username = "user";
      const password = "pass";
      monitoringWorker.setAuthentication({ username, password });
      expect(monitoringWorker.auth).toEqual({ username, password });
    });
  });

  describe("setHeaders", () => {
    it("should set the headers property", () => {
      const headers = { "Content-Type": "application/json" };
      monitoringWorker.setHeaders({ headers });
      expect(monitoringWorker.headers).toEqual(headers);
    });
  });

  describe("setPath", () => {
    it("should set the path property", () => {
      const path = "/api";
      monitoringWorker.setPath({ path });
      expect(monitoringWorker.path).toBe(path);
    });
  });

  describe("addAlerts", () => {
    it("should add alerts to the alerts array", () => {
      const alerts = [
        { type: "email", config: { email: "test@example.com" } },
        { type: "webhook", config: { webhook: "https://example.com" } },
      ];
      monitoringWorker.addAlerts({ alerts });
      expect(monitoringWorker.alerts.length).toBe(alerts.length);
    });
  });

  describe("calculateMetrics", () => {
    it("should update metrics object with successful response", async () => {
      const response = { duration: "100" };
      const updateMetricsObject = {
        "report.status": true,
        $inc: {
          "report.requestCount": 1,
          "report.totalResponseTime": 100,
          "report.uptime": monitoringWorker.interval,
        },
        $push: {
          "report.history": expect.any(Date),
        },
      };
      UrlService.updateMetrics = jest.fn().mockResolvedValue({});

      await monitoringWorker.calculateMetrics(response, true);

      expect(UrlService.updateMetrics).toHaveBeenCalledWith(
        monitoringWorker.name,
        updateMetricsObject
      );
    });

    it("should update metrics object with failed response", async () => {
      const response = { duration: "100" };
      const updateMetricsObject = {
        "report.status": false,
        $inc: {
          "report.requestCount": 1,
          "report.totalResponseTime": 100,
          "report.outages": 1,
          "report.downtime": monitoringWorker.interval,
        },
        $push: {
          "report.history": expect.any(Date),
        },
      };
      monitoringWorker.failureCounter = 3; // Assuming failureCounter is already 2
      UrlService.updateMetrics = jest.fn().mockResolvedValue({});
      alertEventEmitter.emit = jest.fn().mockResolvedValue({});
      await monitoringWorker.calculateMetrics(response, false);

      expect(UrlService.updateMetrics).toHaveBeenCalledWith(
        monitoringWorker.name,
        updateMetricsObject
      );
      expect(alertEventEmitter.emit).toHaveBeenCalledWith(
        "notification",
        monitoringWorker.name,
        monitoringWorker.alerts
      );
    });
  });
});
