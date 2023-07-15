const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UrlService = require("../../modules/urls/url-service");
const Url = require("../../modules/urls/url-model");

let mongoServer;

const url = {
  name: "example.com",
  report: {},
  ignoreSSL: true,
  protocol: "HTTPS",
  url: "example.com",
  user: "example@example.com",
};

const defaultReport = {
  downtime: 0,
  history: [],
  outages: 0,
  requestCount: 0,
  status: null,
  totalResponseTime: 0,
  uptime: 0,
};

const testReportData = {
  downtime: 10000,
  history: [],
  outages: 3,
  requestCount: 6,
  status: true,
  totalResponseTime: 15000,
  uptime: 5000,
};

function assertCreatedUrlProperties(createdUrl, url, objectId = true) {
  if (objectId) {
    expect(createdUrl).toHaveProperty("_id");
  }
  expect(createdUrl).toHaveProperty("alerts", url.alerts || []);
  expect(createdUrl).toHaveProperty("ignoreSSL", url.ignoreSSL);
  expect(createdUrl).toHaveProperty("interval", url.interval || 10);
  expect(createdUrl).toHaveProperty("name", url.name);
  expect(createdUrl).toHaveProperty("protocol", url.protocol);
  expect(createdUrl).toHaveProperty("tags", url.tags || []);
  expect(createdUrl).toHaveProperty("user", url.user);
  expect(createdUrl).toHaveProperty("threshold", 1);
  expect(createdUrl).toHaveProperty("timeout", 5);
}

function assertCreatedReportDefaultProperties(createdUrl) {
  expect(createdUrl).toHaveProperty("report._id");
  expect(createdUrl).toHaveProperty("report.downtime", 0);
  expect(createdUrl).toHaveProperty("report.history");
  expect(createdUrl).toHaveProperty("report.totalResponseTime", 0);
  expect(createdUrl).toHaveProperty("report.outages", 0);
  expect(createdUrl).toHaveProperty("report.uptime", 0);
  expect(createdUrl).toHaveProperty("report.requestCount", 0);
  expect(createdUrl).toHaveProperty("report.status");
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("UrlService", () => {
  beforeEach(async () => {
    await Url.deleteMany();
  });

  describe("createUrl", () => {
    it("should create a new URL", async () => {
      const url = {
        name: "example.com",
        report: {},
        ignoreSSL: true,
        protocol: "HTTPS",
        url: "example.com",
        user: "example@example.com",
      };
      await UrlService.createUrl(url);
      const createdUrl = await Url.findOne({ name: "example.com" }).lean();
      assertCreatedUrlProperties(createdUrl, url);
      assertCreatedReportDefaultProperties(createdUrl);
    });
  });
  describe("getUrl", () => {
    it("should get a URL by name", async () => {
      const url = new Url({
        name: "example.com",
        report: {},
        ignoreSSL: true,
        protocol: "HTTPS",
        url: "example.com",
        user: "example@example.com",
      });
      await url.save();
      const result = await UrlService.getUrl("example.com");
      assertCreatedUrlProperties(result, url.toObject(), false);
    });
  });
  describe("getUrls", () => {
    it("should get all URLs", async () => {
      const urls = [
        {
          name: "example1.com",
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example1.com",
          user: "example1@example.com",
          timeout: 5,
          interval: 10,
          threshold: 1,
          tags: [],
          alerts: [],
        },
        {
          name: "example2.com",
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example2.com",
          user: "example2@example.com",
          timeout: 5,
          interval: 10,
          threshold: 1,
          tags: [],
          alerts: [],
        },
      ];
      await Url.insertMany(urls);
      const result = await UrlService.getUrls();
      expect(result).toEqual(urls);
    });
  });
  describe("getUrlsByEmail", () => {
    it("should get URLs by user", async () => {
      const user = "test@example.com";
      const urls = [
        {
          name: "example1.com",
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example1.com",
          user,
          timeout: 5,
          interval: 10,
          threshold: 1,
          tags: [],
          alerts: [],
        },
        {
          name: "example2.com",
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example2.com",
          user,
          timeout: 5,
          interval: 10,
          threshold: 1,
          tags: [],
          alerts: [],
        },
      ];
      await Url.insertMany(urls);
      const result = await UrlService.getUrlsByEmail(user);
      expect(result).toEqual(urls);
    });
  });
  describe("deleteUrl", () => {
    it("should delete a URL by name", async () => {
      const url = new Url({
        name: "example.com",
        report: {},
        ignoreSSL: true,
        protocol: "HTTPS",
        url: "example.com",
        user: "example@example.com",
      });
      await url.save();
      const result = await UrlService.deleteUrl("example.com");
      expect(result.deletedCount).toEqual(1);
      const deletedUrl = await Url.findOne({ name: "example.com" });
      expect(deletedUrl).toBeNull();
    });
  });
  describe("updateUrl", () => {
    it("should update a URL by name", async () => {
      const url = new Url({
        name: "example.com",
        report: {},
        ignoreSSL: true,
        protocol: "HTTPS",
        url: "example.com",
        user: "example@example.com",
      });
      await url.save();
      const updatedUrl = { name: "updated.com", report: {} };
      const result = await UrlService.updateUrl("example.com", updatedUrl);
      expect(result.name).toEqual("updated.com");
    });
  });
  describe("getReportByTag", () => {
    it("should get reports by user and tag", async () => {
      const user = "test@example.com";
      const tags = ["tag1"];
      const reports = [
        {
          name: "example1.com",
          tags,
          report: defaultReport,
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example1.com",
          user,
        },
        {
          name: "example2.com",
          tags,
          report: defaultReport,
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example2.com",
          user,
        },
      ];
      await Url.insertMany(reports);
      const result = await UrlService.getReportByTag(user, tags);
      expect(result.length).toEqual(reports.length);
      result.forEach((report, index) => {
        expect(report).toEqual(UrlService.formatReport(reports[index]));
      });
    });
  });
  describe("getReports", () => {
    it("should get all reports by user", async () => {
      const user = "test@example.com";
      const reports = [
        {
          name: "example1.com",
          report: testReportData,
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example1.com",
          user,
        },
        {
          name: "example2.com",
          report: testReportData,
          ignoreSSL: true,
          protocol: "HTTPS",
          url: "example2.com",
          user,
        },
      ];
      await Url.insertMany(reports.map((report) => ({ ...report, user })));
      const result = await UrlService.getReports(user);
      expect(result.length).toEqual(reports.length);
      result.forEach((report, index) => {
        expect(report).toEqual(UrlService.formatReport(reports[index]));
      });
    });
  });
  describe("getReport", () => {
    it("should get a report by name", async () => {
      const report = {
        name: "example.com",
        ignoreSSL: true,
        protocol: "HTTPS",
        url: "example1.com",
        user: "example@example.com",
        report: testReportData,
      };
      await Url.create(report);
      const result = await UrlService.getReport(report.name);
      expect(result).toEqual(UrlService.formatReport(report));
    });
  });
  describe("updateMetrics", () => {
    it("should update metrics for a URL", async () => {
      const url = new Url({
        name: "example.com",
        report: defaultReport,
        ignoreSSL: true,
        protocol: "HTTPS",
        url: "example.com",
        user: "example@example.com",
      });
      await url.save();
      const metricsQuery = {
        "report.status": true,
        $inc: {
          "report.requestCount": 1,
          "report.totalResponseTime": 1000,
        },
        $push: {
          "report.history": new Date(),
        },
        "report.uptime": 10000,
      };
      const result = await UrlService.updateMetrics(url.name, metricsQuery);
      expect(result.report.uptime).toEqual(10000);
    });
  });
});
