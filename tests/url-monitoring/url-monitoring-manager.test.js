const MonitoringWorkersManager = require("../../modules/url-monitoring/monitoring-worker-manager");
const UrlService = require("../../modules/urls/url-service");
const MonitoringWorker = require("../../modules/url-monitoring/monitoring-worker");

jest.mock("../../modules/urls/url-service");
jest.mock("../../modules/url-monitoring/monitoring-worker");

describe("MonitoringWorkersManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getInstance", () => {
    it("should return the same instance when called multiple times", () => {
      const instance1 = MonitoringWorkersManager.getInstance();
      const instance2 = MonitoringWorkersManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("createWorker", () => {
    it("should create a new monitoring worker with the given URL", () => {
      const url = { name: "example" };
      const monitoringWorker = {
        start: jest.fn(),
        createAxiosInstance: jest.fn(),
      };
      MonitoringWorker.mockImplementation(() => monitoringWorker);

      const manager = new MonitoringWorkersManager();
      const result = manager.createWorker(url);

      expect(MonitoringWorker).toHaveBeenCalledWith(url);
      expect(result).toBe(monitoringWorker);
    });

    it("should call the appropriate methods on the monitoring worker if URL properties exist", () => {
      const url = {
        name: "example",
        port: 8080,
        authentication: { username: "user", password: "pass" },
        httpHeaders: { "Content-Type": "application/json" },
        path: "/api",
        alerts: ["500 Internal Server Error"],
      };
      const monitoringWorker = {
        start: jest.fn(),
        setPort: jest.fn(),
        setAuthentication: jest.fn(),
        setHeaders: jest.fn(),
        setPath: jest.fn(),
        addAlerts: jest.fn(),
        createAxiosInstance: jest.fn(),
      };
      MonitoringWorker.mockImplementation(() => monitoringWorker);

      const manager = new MonitoringWorkersManager();
      const result = manager.createWorker(url);

      expect(monitoringWorker.setPort).toHaveBeenCalledWith(url);
      expect(monitoringWorker.setAuthentication).toHaveBeenCalledWith(url);
      expect(monitoringWorker.setHeaders).toHaveBeenCalledWith(url);
      expect(monitoringWorker.setPath).toHaveBeenCalledWith(url);
      expect(monitoringWorker.addAlerts).toHaveBeenCalledWith(url);
      expect(monitoringWorker.createAxiosInstance).toHaveBeenCalled();
      expect(result).toBe(monitoringWorker);
    });
  });

  describe("addNewWorkerToPool", () => {
    it("should create a new worker with the given URL and add it to the workers pool", () => {
      const url = { name: "example", port: 8080 };
      const monitoringWorker = { start: jest.fn() };
      MonitoringWorker.mockImplementation(() => monitoringWorker);

      const manager = new MonitoringWorkersManager();
      manager.createWorker = jest.fn(() => monitoringWorker);

      manager.addNewWorkerToPool(url);

      expect(manager.createWorker).toHaveBeenCalledWith(url);
      expect(manager.workersPool.size).toBe(1);
      expect(manager.workersPool.get("example")).toBe(monitoringWorker.name);
    });
  });

  describe("initWorkers", () => {
    it("should fetch URLs from UrlService and add new workers to the pool for each URL", async () => {
      const urls = [
        { name: "example1", port: 8080 },
        { name: "example2", port: 8081 },
      ];
      UrlService.getUrls.mockResolvedValue(urls);

      const manager = new MonitoringWorkersManager();
      manager.addNewWorkerToPool = jest.fn();

      await manager.initWorkers();

      expect(UrlService.getUrls).toHaveBeenCalled();
      expect(manager.addNewWorkerToPool).toHaveBeenCalledTimes(2);
      expect(manager.addNewWorkerToPool).toHaveBeenNthCalledWith(1, urls[0]);
      expect(manager.addNewWorkerToPool).toHaveBeenNthCalledWith(2, urls[1]);
    });

    it("should log a message if no URLs are fetched", async () => {
      UrlService.getUrls.mockResolvedValue(null);
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const manager = new MonitoringWorkersManager();
      manager.addNewWorkerToPool = jest.fn();

      await manager.initWorkers();

      expect(consoleSpy).toHaveBeenCalledWith("No Urls to check");
      expect(manager.addNewWorkerToPool).not.toHaveBeenCalled();
    });
  });

  describe("deleteWorker", () => {
    it("should stop and remove the worker from the workers pool", () => {
      const name = "example";
      const monitoringWorker = { stop: jest.fn() };

      const manager = new MonitoringWorkersManager();
      manager.workersPool.set(name, monitoringWorker);

      const result = manager.deleteWorker(name);

      expect(monitoringWorker.stop).toHaveBeenCalled();
      expect(manager.workersPool.size).toBe(0);
      expect(result).toBe(true);
    });

    it("should return false if the worker does not exist in the workers pool", () => {
      const name = "example";
      const manager = new MonitoringWorkersManager();

      const result = manager.deleteWorker(name);

      expect(result).toBe(false);
    });
  });

  describe("updateWorker", () => {
    it("should delete the old worker and add a new worker to the pool with the updated URL", () => {
      const oldUrlName = "old-example";
      const url = { name: "new-example", port: 8080 };
      const monitoringWorker = { start: jest.fn() };
      MonitoringWorker.mockImplementation(() => monitoringWorker);

      const manager = new MonitoringWorkersManager();
      manager.deleteWorker = jest.fn();
      manager.createWorker = jest.fn(() => monitoringWorker);

      manager.updateWorker(oldUrlName, url);

      expect(manager.deleteWorker).toHaveBeenCalledWith(oldUrlName);
      expect(manager.createWorker).toHaveBeenCalledWith(url);
      expect(manager.workersPool.size).toBe(1);
      expect(manager.workersPool.get("new-example")).toBe(
        monitoringWorker.name
      );
    });
  });
});
