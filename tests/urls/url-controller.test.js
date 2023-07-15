const UrlController = require("../../modules/urls/url-controller");
const UrlService = require("../../modules/urls/url-service");
const MonitoringWorkersManager = require("../../modules/url-monitoring/monitoring-worker-manager");
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../../constants/response");

jest.mock("../../modules/urls/url-service");
jest.mock("../../modules/url-monitoring/monitoring-worker-manager");

const testData = {
  name: "Test URL",
  user: "testuser@example.com",
  url: "http://example.com",
  protocol: "HTTP",
  path: "/test",
  port: 80,
  webhook: "http://example.com/webhook",
  timeout: 5,
  interval: 10,
  threshold: 1,
  username: "testuser",
  password: "testpassword",
  httpHeaders: {
    "Content-Type": "application/json",
    Authorization: "Bearer token",
  },
  statusCode: 200,
  tags: ["tag1", "tag2"],
  ignoreSSL: false,
  alerts: [
    {
      type: "email",
      config: {
        recipients: ["testuser@example.com"],
        subject: "Alert: Test URL Down",
      },
    },
    {
      type: "sms",
      config: {
        phoneNumber: "+1234567890",
        message: "Test URL is down!",
      },
    },
  ],
};

const reportTestData = {
  report: {
    status: true,
    requestCount: 2,
    outages: 2,
    downtime: 120,
    uptime: 4320,
    totalResponseTime: 1000,
    history: [new Date("2023-07-15"), new Date("2023-07-14")],
  },
};

describe("UrlController", () => {
  describe("createUrl", () => {
    it("should create a new URL and return success response", async () => {
      const req = {
        body: { url: "http://example.com" },
        user: { email: "user@example.com" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const urlResult = testData;
      UrlService.createUrl.mockResolvedValue(urlResult);
      MonitoringWorkersManager.getInstance.mockReturnValue({
        addNewWorkerToPool: jest.fn(),
      });

      await UrlController.createUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.URL_CREATED,
      });
      expect(
        MonitoringWorkersManager.getInstance().addNewWorkerToPool
      ).toHaveBeenCalledWith(urlResult);
    });

    it("should handle URL creation error and return error response", async () => {
      const req = {
        body: { url: "http://example.com" },
        user: { email: "user@example.com" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      UrlService.createUrl.mockResolvedValue(null);

      await UrlController.createUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.URL_CREATION_ERROR,
      });
    });
  });

  describe("getUrls", () => {
    it("should get URLs by email and return success response", async () => {
      const req = { user: { email: "user@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const urlResult = testData;
      UrlService.getUrlsByEmail.mockResolvedValue(urlResult);

      await UrlController.getUrls(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ data: urlResult });
    });
  });

  describe("getUrl", () => {
    it("should get a URL by name and return success response", async () => {
      const req = { params: { name: "test-url" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const urlResult = testData;
      UrlService.getUrl.mockResolvedValue(urlResult);

      await UrlController.getUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ data: urlResult });
    });
  });

  describe("deleteUrl", () => {
    it("should delete a URL and return success response", async () => {
      const req = { params: { name: "test-url" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const urlResult = testData;
      UrlService.deleteUrl.mockResolvedValue(urlResult);
      MonitoringWorkersManager.getInstance.mockReturnValue({
        deleteWorker: jest.fn(),
      });

      await UrlController.deleteUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.URL_DELETED,
      });
      expect(
        MonitoringWorkersManager.getInstance().deleteWorker
      ).toHaveBeenCalledWith("test-url");
    });

    it("should handle URL deletion error and return error response", async () => {
      const req = { params: { name: "test-url" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      UrlService.deleteUrl.mockResolvedValue(null);

      await UrlController.deleteUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.URL_DELETION_ERROR,
      });
    });
  });

  describe("updateUrl", () => {
    it("should update a URL and return success response", async () => {
      const req = {
        body: { url: "http://example.com" },
        params: { name: "test-url" },
        user: { email: "user@example.com" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const urlResult = testData;
      UrlService.updateUrl.mockResolvedValue(urlResult);
      MonitoringWorkersManager.getInstance.mockReturnValue({
        updateWorker: jest.fn(),
      });

      await UrlController.updateUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.URL_UPDATED,
      });
      expect(
        MonitoringWorkersManager.getInstance().updateWorker
      ).toHaveBeenCalledWith("test-url", urlResult);
    });

    it("should handle URL update error and return error response", async () => {
      const req = {
        body: { url: "http://example.com" },
        params: { name: "test-url" },
        user: { email: "user@example.com" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      UrlService.updateUrl.mockResolvedValue(null);

      await UrlController.updateUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: RESPONSE_MESSAGES.URL_DELETION_ERROR,
      });
    });
  });

  describe("getReport", () => {
    it("should get a report by name and return success response", async () => {
      const req = { params: { name: "test-url" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const reportResult = reportTestData;
      UrlService.getReport.mockResolvedValue(reportResult);

      await UrlController.getReport(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ data: reportResult });
    });
  });

  describe("getReports", () => {
    it("should get reports by email and return success response", async () => {
      const req = { user: { email: "user@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const reportResult = reportTestData;
      UrlService.getReports.mockResolvedValue(reportResult);

      await UrlController.getReports(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ data: reportResult });
    });
  });

  describe("getReportsByTag", () => {
    it("should get reports by email and tag and return success response", async () => {
      const req = {
        user: { email: "user@example.com" },
        params: { tag: "tag1" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const reportResult = reportTestData;
      UrlService.getReportByTag.mockResolvedValue(reportResult);

      await UrlController.getReportsByTag(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ data: reportResult });
    });
  });
});
