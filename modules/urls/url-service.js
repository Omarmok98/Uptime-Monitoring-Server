const Url = require("./url-model");
class UrlService {
  static formatReport({ name, report }) {
    const uptimeInSec = parseInt(report.uptime / 1000);
    const downtimeInSec = parseInt(report.downtime / 1000);
    const totalResponseTimeInSec = parseInt(report.totalResponseTime / 1000);
    const responseTime =
      parseFloat(report.totalResponseTime / parseInt(report.requestCount)) || 0;
    const availability =
      parseFloat(report.uptime / report.downtime + report.uptime) * 100 || 0;
    return {
      name: name,
      status: report.status,
      outages: report.outages,
      uptimeInSec,
      downtimeInSec,
      totalResponseTimeInSec,
      requestCount: report.requestCount,
      responseTime,
      availability,
      history: report.history,
    };
  }
  static async createUrl(url) {
    url.report = {}; // adding report so that default values can be inserted
    const newUrl = new Url(url);
    const result = await newUrl.save();
    return result;
  }

  static async getUrl(name) {
    const url = await Url.findOne({ name }).select("-_id -report").lean();
    return url;
  }

  static async getUrls() {
    const urls = await Url.find().select("-_id -report -__v").lean();
    return urls;
  }

  static async getUrlsByEmail(user) {
    const urls = await Url.find({ user }).select("-_id -report -__v").lean();
    return urls;
  }
  static async deleteUrl(name) {
    const result = await Url.deleteOne({ name });
    return result;
  }

  static async updateUrl(name, url) {
    const newUrl = await Url.findOneAndUpdate({ name }, url, { new: true });
    return newUrl;
  }

  // report specific methods
  static async getReportByTag(user, tags) {
    const reports = await Url.find({ user, tags })
      .select("-_id name report")
      .lean();
    const result = [];
    for (const report of reports) {
      result.push(this.formatReport(report));
    }
    return result;
  }

  static async getReports(user) {
    const reports = await Url.find({ user }).select("-_id name  report").lean();
    const result = [];
    for (const report of reports) {
      result.push(this.formatReport(report));
    }
    return result;
  }

  static async getReport(name) {
    const report = await Url.findOne({ name })
      .select("-_id name report")
      .lean();
    return this.formatReport(report);
  }

  static async updateMetrics(name, metricsQuery) {
    const updateMetricsResult = await Url.findOneAndUpdate(
      { name },
      metricsQuery,
      { new: true }
    );
    console.log(updateMetricsResult);
    return updateMetricsResult;
  }
}

module.exports = UrlService;
