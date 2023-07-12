const Url = require("./url-model");

class UrlService {
  static async createUrl(url) {
    const newUrl = new Url(url);
    const result = await newUrl.save();
    return result;
  }

  static async getUrl(name) {
    const url = await Url.findOne({ name }).lean();
    return url;
  }

  static async getUrls() {
    const urls = await Url.find().lean();
    return urls;
  }

  static async getUrlsByEmail(email) {
    const urls = await Url.find({ email }).lean();
    return urls;
  }

  static async getUrlsByTag(email, tag) {
    const urls = await Url.find({ email, tag }).lean();
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
}

module.exports = UrlService;
